// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const client = require('./client/client')


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let activateExtension = vscode.commands.registerCommand('demo.activateExtension', () => {
		vscode.window.showInformationMessage('The demo extension is activated now');
	});

	console.log('Congratulations, your extension "plugin" is now active!');
	/*
	context.subscriptions.push(vscode.commands.registerCommand('plugin.genTestCase',(uri)=>{
		var filename;
		if(uri){
			filename = uri.fsPath;
			client.kleeGeneration({
				name: filename
			});
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('plugin.showTestCase',(uri)=>{
		var testCasePath;
		if(uri){
			testCasePath = uri.fsPath;
			client.kleeShow({
				name: testCasePath
			});
		}
	}));
	*/

	context.subscriptions.push(vscode.commands.registerCommand('plugin.useCppCheck',(uri)=>{
		var currentFilePath;
		if(uri){
			currentFilePath = uri.fsPath;
			var fileName = {
				name: currentFilePath
			};
			console.log(client);
			client.cppCheck(fileName);
		}
	}));
	context.subscriptions.push(vscode.commands.registerCommand('plugin.highLight',(uri)=>{
		var currentFilePath;
		if(uri){
			currentFilePath = uri.fsPath;
			var fileName = {
				name: currentFilePath
			};
			console.log(client);
			client.highLight(fileName);
		}
	}));


}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
