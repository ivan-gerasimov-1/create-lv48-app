import type { TPromptAnswers } from '../prompts/types.js';
import type { TPlaceholderValues } from '../generate/types.js';

export function createPlaceholderValues(answers: TPromptAnswers): TPlaceholderValues {
  return {
    projectName: answers.projectName,
    packageName: answers.packageName,
    displayName: answers.displayName,
    targetDirectory: answers.targetDirectory,
    webPackageName: `@${answers.packageName}/web`,
    sitePackageName: `@${answers.packageName}/site`,
    apiPackageName: `@${answers.packageName}/api`,
  };
}
