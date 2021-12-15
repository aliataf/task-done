import { commands, ExtensionContext } from "vscode";

export function activate(context: ExtensionContext) {
  let disposable = commands.registerCommand("task-done.taskDone", () => {
    Promise.all([
      commands.executeCommand("workbench.files.action.collapseExplorerFolders"),
      commands.executeCommand("workbench.action.closeAllEditors"),
    ]);
  });
  context.subscriptions.push(disposable);
}

export function deactivate() {}
