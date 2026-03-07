import { spawn } from 'node:child_process';

import type {
  CommandExecutor,
  PostSetupActionStatus,
  PostSetupExecutor,
} from './types.js';

export function createPostSetupExecutor(
  commandExecutor: CommandExecutor = executeCommand,
): PostSetupExecutor {
  return {
    async run({ targetRoot, installDependencies, initializeGit }) {
      const statuses: PostSetupActionStatus[] = [];

      statuses.push(
        await runOptionalAction({
          selected: installDependencies,
          name: 'installDependencies',
          detail: 'npm install',
          run() {
            return commandExecutor('npm', ['install'], targetRoot);
          },
        }),
      );

      statuses.push(
        await runOptionalAction({
          selected: initializeGit,
          name: 'initializeGit',
          detail: 'git init',
          run() {
            return commandExecutor('git', ['init'], targetRoot);
          },
        }),
      );

      return statuses;
    },
  };
}

async function runOptionalAction(options: {
  selected: boolean;
  name: 'installDependencies' | 'initializeGit';
  detail: string;
  run(): Promise<void>;
}): Promise<PostSetupActionStatus> {
  if (!options.selected) {
    return {
      name: options.name,
      selected: false,
      ok: true,
      detail: `${options.detail} skipped`,
    };
  }

  try {
    await options.run();

    return {
      name: options.name,
      selected: true,
      ok: true,
      detail: `${options.detail} completed`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown command failure';

    return {
      name: options.name,
      selected: true,
      ok: false,
      detail: `${options.detail} failed: ${message}`,
    };
  }
}

function executeCommand(command: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (exitCode) => {
      if (exitCode === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${exitCode ?? 'unknown'}`));
    });
  });
}
