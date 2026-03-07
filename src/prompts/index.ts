import { createReadlinePromptIo } from './readlinePromptIo.js';
import type { PromptAnswers, PromptController, PromptIO } from './types.js';
import {
  validatePackageName,
  validateProjectName,
  validateTargetDirectory,
} from '../utils/validation.js';

export function createPromptController(promptIo: PromptIO = createReadlinePromptIo()): PromptController {
  return {
    phase: 'phase-1',
    async collectAnswers(defaultProjectName = 'lv48-app') {
      try {
        const projectName = await askValidText(
          promptIo,
          'Project name',
          defaultProjectName,
          validateProjectName,
        );
        const targetDirectory = await askValidText(
          promptIo,
          'Target directory',
          projectName,
          validateTargetDirectory,
        );
        const installDependencies = await promptIo.askConfirm(
          'Install npm dependencies after generation?',
          true,
        );
        const initializeGit = await promptIo.askConfirm(
          'Initialize a git repository?',
          true,
        );
        const packageNameResult = validatePackageName(projectName);

        if (!packageNameResult.ok) {
          throw new Error(packageNameResult.reason);
        }

        return {
          projectName,
          packageName: packageNameResult.value,
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
  promptIo: PromptIO,
  message: string,
  defaultValue: string,
  validate: (input: string) => { ok: true; value: string } | { ok: false; reason: string },
) {
  for (;;) {
    const answer = await promptIo.askText(message, defaultValue);
    const result = validate(answer);

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
    .map((segment) => `${segment[0]!.toUpperCase()}${segment.slice(1)}`)
    .join(' ');
}

export type { PromptAnswers, PromptController, PromptIO };
