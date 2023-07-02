from email import contentmanager
import os

from concurrent import futures
import logging
import re

import grpc
import testgen_pb2
import testgen_pb2_grpc


class TestCaseGeneration(testgen_pb2_grpc.TestCaseGenerationServicer):
    def kleeGeneration(self, callback):
        filePath = self.name
        # Get bc file name
        array = filePath.split('/')
        fileName = array.pop()
        fileNameWithoutSuffix = fileName.split('.')[0]
        bcFileName = fileNameWithoutSuffix + '.bc'
        # Get folder name
        folderName = ''
        array = array[1:]
        for v in array:
            folderName += '/' + v
        bcFilePath = os.path.join(folderName, bcFileName)
        # Compile c file to bitcode and generate test cases with klee
        print('INFO: compiling {0} to bitcode'.format(filePath))
        os.system('clang-6.0 -emit-llvm -c -g -O0 -Xclang -disable-O0-optnone {0} -o {1}'.format(filePath, bcFilePath))
        print('INFO: Generating test cases with klee')
        os.system('klee {0}'.format(bcFilePath))
        print('INFO: Generation done')
        print()
        # Get test case number
        testCaseNumber = 0
        kleeOutputDir = os.path.join(folderName, 'klee-last')
        for file in os.listdir(kleeOutputDir):
            if file.endswith('ktest'):
                testCaseNumber += 1

        return testgen_pb2.TestCaseNumber(number = testCaseNumber)

    def kleeShow(self, callback):
        testCasePath = self.name
        os.system('ktest-tool {0} > output.txt'.format(testCasePath))
        testCaseContent = ''
        with open('output.txt', 'r') as f:
            testCaseContent = f.read()
        return testgen_pb2.TestCaseContent(content = testCaseContent)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    testgen_pb2_grpc.add_TestCaseGenerationServicer_to_server(TestCaseGeneration, server)
    server.add_insecure_port('[::]:50000')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig()
    serve()
