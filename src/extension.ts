import {
  commands,
  ExtensionContext,
  Tab,
  TabInputCustom,
  TabInputNotebook,
  TabInputNotebookDiff,
  TabInputText,
  TabInputTextDiff,
  window,
  workspace,
} from "vscode";

// Only tabs backed by files are closed; webviews (e.g. Claude Code), terminals
// and other non-file tabs are left open.
function isFileTab(tab: Tab): boolean {
  const { input } = tab;
  return (
    input instanceof TabInputText ||
    input instanceof TabInputTextDiff ||
    input instanceof TabInputCustom ||
    input instanceof TabInputNotebook ||
    input instanceof TabInputNotebookDiff
  );
}

export function activate(context: ExtensionContext) {
  const disposable = commands.registerCommand("task-done.taskDone", () => {
    const closeOnlyFileTabs = workspace
      .getConfiguration("taskDone")
      .get<boolean>("closeOnlyFileTabs", true);

    return Promise.all([
      commands.executeCommand("workbench.files.action.collapseExplorerFolders"),
      closeOnlyFileTabs
        ? window.tabGroups.close(
            window.tabGroups.all.flatMap((group) => group.tabs).filter(isFileTab)
          )
        : commands.executeCommand("workbench.action.closeAllEditors"),
    ]);
  });
  context.subscriptions.push(disposable);
}

export function deactivate() {}
