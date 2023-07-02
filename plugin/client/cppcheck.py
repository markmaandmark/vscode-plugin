from distutils.log import error
import os

from concurrent import futures
import logging
import re

import grpc
import test_pb2
import test_pb2_grpc


def to_html(filePath):
    import sys
    from lxml import etree
    xml_path = filePath + '/error/dir_err.xml'
    xml_tree = etree.parse(xml_path)
    xml_file_content = etree.tostring(xml_tree, encoding = 'UTF-8', method = 'xml')
    xml_dom = etree.XML(xml_file_content)
    transform = etree.XSLT(xml_dom)
    html_result = transform(xml_dom)
    print(html_result)
    str_html = str(html_result)
    with open(filePath + '/error/htmlResult.html') as fhtml:
        fhtml.write(str_html)
        fhtml.close()

class PluginServiceGeneration(test_pb2_grpc.pluginServiceServicer):
    def cppCheck(self, callback):
        print('INFO: starting')
        filePath = self.name
        print('INFO: checking '+filePath)
        '''
        error_path = os.path.join(filePath,'error')
        error_xml_path = os.path.join(filePath,'error_xml')
        print('INFO: error_path: '+error_path)
        print('INFO: error_xml_path: '+error_xml_path)
        os.system('mkdir -p '+error_path)
        os.system('mkdir -p '+error_xml_path)
        '''
        filename = filePath.split('/')[-1]
        realPath = os.path.dirname(filePath)
        print('INFO: realPath: '+realPath)
        if(os.path.isdir(filePath)):
            os.system('mkdir -p '+os.path.join(filePath,'error'))
            error_ins = 'cppcheck --enable=all --std=posix '+filePath+' 2> '+filePath+'/error/dir_err.txt'

            error_path_ins = 'cppcheck --enable=all --std=posix --xml '+filePath+' 2> '+filePath+'/error/dir_err.xml'
            os.system(error_ins)
            os.system(error_path_ins)
            with open(filePath+'/error/dir_err.txt') as f:
                output = f.read()
        else:
            os.system('mkdir -p '+os.path.join(realPath,'error'))
            error_ins = 'cppcheck --enable=all --std=posix '+filePath+' 2> '+realPath+'/error/'+filename+'_error.txt'
            error_path_ins = 'cppcheck --enable=all --std=posix --xml '+filePath+' 2> '+realPath+'/error/'+filename+'_error.xml'
            os.system(error_ins)
            os.system(error_path_ins)
            with open(realPath+'/error/'+filename+'_error.txt') as f:
                output = f.read()
        print('INFO: error_path: '+error_ins)
        print('INFO: error_path_xml: '+error_ins)
        print('INFO: finished '+filePath)
        return test_pb2.CppCheckContent(content="Checking finished. Result is stored.",output=output)

    def highLight(self, callback):
        import xml.etree.ElementTree as ET
        from xml.etree.ElementTree import Element
        print('INFO: starting')
        filePath = self.name
        realPath = os.path.dirname(filePath)
        filename = filePath.split('/')[-1]
        cont = []
        if(not(os.path.exists(os.path.join(realPath,'error')))):
            return test_pb2.TestCaseContent(title='You have not use Cppcheck yet.',content='')
        if(not(os.path.exists(os.path.join(realPath,'error/dir_err.xml')))):
            if(not(os.path.exists(os.path.join(realPath,'error/'+filename+'_error.xml')))):
                return test_pb2.TestCaseContent(title='You have not use Cppcheck yet.',content='')
            else:
                xml_name = os.path.join(realPath,'error/'+filename+'_error.xml')
                tree = ET.parse(xml_name)
                root = tree.getroot().getchildren()[1]
                for err in root:
                    print(err)
                    if(err.attrib['severity'] == 'warning' or err.attrib['severity'] == 'error'):
                        if(err[0].attrib['file'] == filePath):
                            cont.append(err[0].attrib['line'])
        else:
            xml_name = os.path.join(realPath,'error/dir_err.xml')
            tree = ET.parse(xml_name)
            root = tree.getroot().getchildren()[1]
            for err in root:
                print(err.attrib['severity'])
                if(err.attrib['severity'] == 'warning' or err.attrib['severity'] == 'error'):
                    if(err[0].attrib['file'] == filePath):
                        cont.append(err[0].attrib['line'])
        return test_pb2.TestCaseContent(title='CppCheck HighLight has prepared.',content=cont)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    test_pb2_grpc.add_pluginServiceServicer_to_server(PluginServiceGeneration, server)
    server.add_insecure_port('[::]:50000')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig()
    serve()
