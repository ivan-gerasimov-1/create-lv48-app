import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildInitializationSummary, formatInitializationSummary } from '../src/cli/summary.js';
import { createPostSetupExecutor } from '../src/cli/postSetup.js';
import { assertContains } from './helpers.js';

describe('post-setup', () => {
  it('initializes git repositories on the main branch when git supports the initial branch flag', async () => {
    let executor = createPostSetupExecutor(async () => {});

    assert.deepEqual(
      await executor.run({
        targetRoot: '/tmp/demo-app',
        installDependencies: false,
        initializeGit: true,
      }),
      [
      {
        name: 'installDependencies',
        selected: false,
        ok: true,
        detail: 'npm install skipped',
      },
      {
        name: 'initializeGit',
        selected: true,
        ok: true,
        detail: 'git init completed',
      },
      ],
    );
  });

  it('falls back to a compatible main-branch setup when git does not support the initial branch flag', async () => {
    let executor = createPostSetupExecutor(async (command, args) => {
      if (command === 'git' && args[0] === 'init' && args[1] === '--initial-branch=main') {
        throw new Error('error: unknown option `initial-branch=main`');
      }
    });

    assert.deepEqual(
      await executor.run({
        targetRoot: '/tmp/demo-app',
        installDependencies: false,
        initializeGit: true,
      }),
      [
      {
        name: 'installDependencies',
        selected: false,
        ok: true,
        detail: 'npm install skipped',
      },
      {
        name: 'initializeGit',
        selected: true,
        ok: true,
        detail: 'git init completed',
      },
      ],
    );
  });

  it('runs optional post-setup actions and reports failures without hiding scaffold success', async () => {
    let executor = createPostSetupExecutor(async (command) => {
      if (command === 'git') {
        throw new Error('git unavailable');
      }
    });

    assert.deepEqual(
      await executor.run({
        targetRoot: '/tmp/demo-app',
        installDependencies: true,
        initializeGit: true,
      }),
      [
      {
        name: 'installDependencies',
        selected: true,
        ok: true,
        detail: 'npm install completed',
      },
      {
        name: 'initializeGit',
        selected: true,
        ok: false,
        detail: 'git init failed: git unavailable',
      },
      ],
    );
  });

  it('emits progress messages before running each selected post-setup action', async () => {
    let started: string[] = [];
    let executor = createPostSetupExecutor(async () => {});

    assert.deepEqual(
      await executor.run({
        targetRoot: '/tmp/demo-app',
        installDependencies: true,
        initializeGit: true,
        onActionStart(action) {
          started.push(action.message);
        },
      }),
      [
      {
        name: 'installDependencies',
        selected: true,
        ok: true,
        detail: 'npm install completed',
      },
      {
        name: 'initializeGit',
        selected: true,
        ok: true,
        detail: 'git init completed',
      },
      ],
    );

    assert.deepEqual(started, [
      'Post-setup: installing npm dependencies. This can take a moment...',
      'Post-setup: initializing a git repository on branch main...',
    ]);
  });

  it('builds a final summary with manual next steps when post-setup fails', () => {
    let summary = buildInitializationSummary({
      projectName: 'demo-app',
      targetDirectory: 'demo-app',
      record: {
        createdDirectories: ['/tmp/demo-app'],
        createdFiles: ['/tmp/demo-app/package.json'],
      },
      postSetup: [
        {
          name: 'installDependencies',
          selected: true,
          ok: false,
          detail: 'npm install failed: timeout',
        },
      ],
    });

    assert.deepEqual(summary.nextSteps, [
      'cd demo-app',
      'Review the failed optional steps above and rerun them manually if needed.',
    ]);
    assertContains(formatInitializationSummary(summary), 'installDependencies: FAILED');
  });
});
