import type { PromptAnswers } from '../prompts/types.js';
import type { PlaceholderValues } from '../generate/types.js';

export function createPlaceholderValues(answers: PromptAnswers): PlaceholderValues {
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
