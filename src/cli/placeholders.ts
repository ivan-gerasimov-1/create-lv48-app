import type { TPromptAnswers } from "../prompts/types";
import type { TPlaceholderValues } from "../generate/types";

export function createPlaceholderValues(
  answers: TPromptAnswers,
): TPlaceholderValues {
  let appScope =
    answers.workspaceLayout === "multi" && answers.appProjectName
      ? answers.appProjectName
      : answers.packageName;

  let webWorkspacePath =
    answers.workspaceLayout === "multi" && answers.appProjectName
      ? `apps/${answers.appProjectName}/web`
      : "apps/web";

  let siteWorkspacePath =
    answers.workspaceLayout === "multi" && answers.appProjectName
      ? `apps/${answers.appProjectName}/site`
      : "apps/site";

  let apiWorkspacePath =
    answers.workspaceLayout === "multi" && answers.appProjectName
      ? `apps/${answers.appProjectName}/api`
      : "apps/api";

  return {
    projectName: answers.projectName,
    packageName: answers.packageName,
    displayName: answers.displayName,
    targetDirectory: answers.targetDirectory,
    webPackageName: `@${appScope}/web`,
    sitePackageName: `@${appScope}/site`,
    apiPackageName: `@${appScope}/api`,
    webWorkspacePath,
    siteWorkspacePath,
    apiWorkspacePath,
    workspaceLayout: answers.workspaceLayout,
    appProjectName: answers.appProjectName ?? "",
  };
}
