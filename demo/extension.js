const vscode = require('vscode');
const testgen_client = require('./client/testgen_client')

function activate(context) {
	let activateExtension = vscode.commands.registerCommand('demo.activateExtension', () => {
		vscode.window.showInformationMessage('The demo extension is activated now');
	});

	let generateTestCases = vscode.commands.registerCommand('demo.generateTestCases', (uri) => {
		var currentFilePath;
		if(uri) {
			currentFilePath = uri.fsPath;
			var fileName = {
				name: currentFilePath
			};
			testgen_client.runKleeGeneration(fileName);
		}
	});

	let showTestCases = vscode.commands.registerCommand('demo.showTestCase', (uri) => {
		var testCasePath;
		if(uri) {
			testCasePath = uri.fsPath;
			var testCaseName = {
				name: testCasePath
			};
			testgen_client.runKleeShow(testCaseName);
		}
	});

	context.subscriptions.push(activateExtension);
	context.subscriptions.push(generateTestCases);
	context.subscriptions.push(showTestCases);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
