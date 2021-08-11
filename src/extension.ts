import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('task-done.taskDone', () => {
		vscode.window.showInformationMessage('Hello World from Task Done!');
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {}
