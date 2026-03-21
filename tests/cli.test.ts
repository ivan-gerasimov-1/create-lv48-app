import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it } from 'node:test';

import { runCli } from '../src/cli.js';
import { createPromptController } from '../src/prompts/index.js';
import { listRelativeFiles, readUtf8File, removePaths } from '../src/utils/fs.js';
import { assertContains, createPromptIoMock } from './helpers.js';

let cleanupPaths: string[] = [];

afterEach(async () => {
  await removePaths(cleanupPaths);
  cleanupPaths.length = 0;
});

describe('cli', () => {
  it('prints the package version with --version flag', async () => {
    let logged: string[] = [];
    let originalLog = console.log;
    let originalArgv = [...process.argv];

    process.argv.push('--version');
    console.log = (...args: unknown[]) => { logged.push(String(args[0])); };

    try {
      await runCli();
      let packageJson = JSON.parse(await readUtf8File(path.join(process.cwd(), 'package.json')));
      assert.equal(logged.length, 1);
      assert.equal(logged[0], packageJson.version);
    } finally {
      process.argv = originalArgv;
      console.log = originalLog;
    }
  });

  it('runs the full CLI flow and prints a final summary', async () => {
    let rootDirectory = await mkdtemp(path.join(os.tmpdir(), 'lv48-cli-run-'));
    let messages: string[] = [];

    cleanupPaths.push(rootDirectory);

    await runCli({
      cwd: rootDirectory,
      commandExecutor: async () => {},
      promptController: createPromptController(createPromptIoMock()),
      logger: {
        info(message) {
          messages.push(message);
        },
        debug() {},
        error(message) {
          messages.push(`ERROR: ${message}`);
        },
      },
    });

    assert.ok(messages.some((message) => message.includes('create-lv48-app will scaffold')));
    assert.ok(
      messages.some((message) =>
        message.includes('Post-setup: installing npm dependencies. This can take a moment...'),
      ),
    );
    assertContains(
      await listRelativeFiles(path.join(rootDirectory, 'demo-directory')),
      'apps/web/src/main.tsx',
    );
  });
});
