import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Task Done Extension Test Suite', function() {
	suiteSetup(async function() {
		const extension = vscode.extensions.getExtension('aliataf.task-done');
		if (extension && !extension.isActive) {
			await extension.activate();
		}
	});

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('aliataf.task-done'));
	});

	test('Extension should activate', async () => {
		const extension = vscode.extensions.getExtension('aliataf.task-done');
		if (!extension!.isActive) {
			await extension!.activate();
		}
		assert.strictEqual(extension!.isActive, true);
	});

	test('Command should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('task-done.taskDone'));
	});

	test('Command should execute without error', async () => {
		try {
			await vscode.commands.executeCommand('task-done.taskDone');
		} catch (error) {
			assert.fail(`Command failed: ${error}`);
		}
	});

	// Helper to retry assertions until they pass or timeout
	async function poll(fn: () => boolean, timeout: number = 2000): Promise<void> {
		const start = Date.now();
		while (Date.now() - start < timeout) {
			if (fn()) return;
			await new Promise(r => setTimeout(r, 100));
		}
		throw new Error('Condition not met within timeout');
	}

	test('Command should close all editors', async function() {
		const doc = await vscode.workspace.openTextDocument({ content: 'Test' });
		await vscode.window.showTextDocument(doc);
		assert.strictEqual(vscode.window.visibleTextEditors.length, 1);

		await vscode.commands.executeCommand('task-done.taskDone');

		// Wait for UI to update
		await poll(() => vscode.window.visibleTextEditors.length === 0);
		assert.strictEqual(vscode.window.visibleTextEditors.length, 0);
	});

	test('Command should handle multiple open editors', async function() {
		const doc1 = await vscode.workspace.openTextDocument({ content: 'Diff 1' });
		const doc2 = await vscode.workspace.openTextDocument({ content: 'Diff 2' });
		
		await vscode.window.showTextDocument(doc1, vscode.ViewColumn.One);
		await vscode.window.showTextDocument(doc2, vscode.ViewColumn.Two);
		assert.ok(vscode.window.visibleTextEditors.length >= 2);

		await vscode.commands.executeCommand('task-done.taskDone');

		await poll(() => vscode.window.visibleTextEditors.length === 0);
		assert.strictEqual(vscode.window.visibleTextEditors.length, 0);
	});

	test('Command should be safe to run with no editors', async function() {
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
		assert.strictEqual(vscode.window.visibleTextEditors.length, 0);

		try {
			await vscode.commands.executeCommand('task-done.taskDone');
		} catch (error) {
			assert.fail(`Should not throw: ${error}`);
		}
	});
});
