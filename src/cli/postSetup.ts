import { spawn } from 'node:child_process';

import type {
  CommandExecutor,
  PostSetupActionStatus,
  PostSetupExecutor,
} from './types.js';

const INITIALIZE_GIT_WITH_MAIN_ARGS = ['init', '--initial-branch=main'];
const INITIALIZE_GIT_FALLBACK_ARGS = ['init'];
const SET_GIT_HEAD_TO_MAIN_ARGS = ['symbolic-ref', 'HEAD', 'refs/heads/main'];

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
            return initializeGitRepository(commandExecutor, targetRoot);
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

async function initializeGitRepository(
  commandExecutor: CommandExecutor,
  cwd: string,
): Promise<void> {
  try {
    await commandExecutor('git', INITIALIZE_GIT_WITH_MAIN_ARGS, cwd);
  } catch (error) {
    if (!isUnsupportedInitialBranchError(error)) {
      throw error;
    }

    await commandExecutor('git', INITIALIZE_GIT_FALLBACK_ARGS, cwd);
    await commandExecutor('git', SET_GIT_HEAD_TO_MAIN_ARGS, cwd);
  }
}

function isUnsupportedInitialBranchError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes('initial-branch') &&
    (message.includes('unknown option') ||
      message.includes('unknown switch') ||
      message.includes('unrecognized option') ||
      message.includes('invalid option'))
  );
}

function executeCommand(command: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ['inherit', 'inherit', 'pipe'],
    });
    let stderrOutput = '';

    if (child.stderr) {
      child.stderr.setEncoding('utf8');
      child.stderr.on('data', (chunk) => {
        stderrOutput += chunk;
        process.stderr.write(chunk);
      });
    }

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (exitCode) => {
      if (exitCode === 0) {
        resolve();
        return;
      }

      const message = stderrOutput.trim();

      reject(
        new Error(message.length > 0 ? message : `${command} exited with code ${exitCode ?? 'unknown'}`),
      );
    });
  });
}
