const vscode = require('vscode');

var PROTO_PATH = __dirname + '/../proto/testgen.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var testgen = grpc.loadPackageDefinition(packageDefinition).testgen;
var client = new testgen.TestCaseGeneration('localhost:50000',
                                       grpc.credentials.createInsecure())

function runKleeGeneration(fileName) {
    client.kleeGeneration(fileName, (error, response) => {
        if(error) {
            vscode.window.showErrorMessage(error);
        } else {
            vscode.window.showInformationMessage(`${response.number} test cases were generated`);
        }
    });
}

function runKleeShow(testCaseName) {
    client.kleeShow(testCaseName, (error, response) => {
        if(error) {
            vscode.window.showErrorMessage(error);
        } else {
            vscode.window.showInformationMessage(`${response.content}`);
        }
    });
}

module.exports = {
    runKleeGeneration,
    runKleeShow
}