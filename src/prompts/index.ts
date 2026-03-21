import { createReadlinePromptIo } from './readlinePromptIo.js';
import type { TPromptAnswers, TPromptController, TPromptIO } from './types.js';
import {
  validateProjectName,
  validateTargetDirectory,
} from '../utils/validation.js';

export function createPromptController(promptIo: TPromptIO = createReadlinePromptIo()): TPromptController {
  return {
    async collectAnswers(defaultProjectName = 'lv48-app') {
      try {
        let projectName = await askValidText(
          promptIo,
          'Project name',
          defaultProjectName,
          validateProjectName,
        );
        let targetDirectory = await askValidText(
          promptIo,
          'Target directory',
          projectName,
          validateTargetDirectory,
        );
        let installDependencies = await promptIo.askConfirm(
          'Install npm dependencies after generation?',
          true,
        );
        let initializeGit = await promptIo.askConfirm(
          'Initialize a git repository?',
          true,
        );

        return {
          projectName,
          packageName: projectName,
          displayName: createDisplayName(projectName),
          targetDirectory,
          packageManager: 'npm',
          presetId: 'base',
          installDependencies,
          initializeGit,
        };
      } finally {
        await promptIo.close();
      }
    },
  };
}

async function askValidText(
  promptIo: TPromptIO,
  message: string,
  defaultValue: string,
  validate: (input: string) => { ok: true; value: string } | { ok: false; reason: string },
) {
  for (;;) {
    let answer = await promptIo.askText(message, defaultValue);
    let result = validate(answer);

    if (result.ok) {
      return result.value;
    }

    console.error(result.reason);
  }
}

function createDisplayName(projectName: string): string {
  return projectName
    .split('-')
    .filter((segment) => segment.length > 0)
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join(' ');
}

export type { TPromptAnswers, TPromptController, TPromptIO };
