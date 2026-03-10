import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { afterEach, describe, it } from 'node:test';
import { promisify } from 'node:util';

import { removePaths } from '../src/utils/fs.js';

const cleanupPaths: string[] = [];
const execFileAsync = promisify(execFile);

afterEach(async () => {
  await removePaths(cleanupPaths);
  cleanupPaths.length = 0;
});

describe('release automation', () => {
  it('syncs a managed changeset file for a releasing pull request', async () => {
    const workspaceRoot = await createReleaseAutomationFixture();

    const { stdout } = await runSyncPrChangeset(workspaceRoot, {
      PR_NUMBER: '42',
      PR_TITLE: 'Release automation',
      PR_LABELS_JSON: JSON.stringify(['release:patch']),
    });

    assert.match(stdout, /Synced managed changeset/);
    assert.equal(
      await readFile(path.join(workspaceRoot, '.changeset', 'release-pr-42.md'), 'utf8'),
      '---\n"create-lv48-app": patch\n---\n\nRelease automation\n',
    );
  });

  it('fails when a pull request has zero supported release labels', async () => {
    const workspaceRoot = await createReleaseAutomationFixture();

    await assert.rejects(
      runSyncPrChangeset(workspaceRoot, {
        PR_NUMBER: '42',
        PR_TITLE: 'Release automation',
        PR_LABELS_JSON: JSON.stringify(['priority:high']),
      }),
      /Expected exactly one supported release label/,
    );
  });

  it('fails when a pull request has multiple supported release labels', async () => {
    const workspaceRoot = await createReleaseAutomationFixture();

    await assert.rejects(
      runSyncPrChangeset(workspaceRoot, {
        PR_NUMBER: '42',
        PR_TITLE: 'Release automation',
        PR_LABELS_JSON: JSON.stringify(['release:patch', 'release:minor']),
      }),
      /Expected exactly one supported release label/,
    );
  });

  it('removes the managed changeset file for release:none', async () => {
    const workspaceRoot = await createReleaseAutomationFixture();
    const relativeChangesetPath = path.join(workspaceRoot, '.changeset', 'release-pr-42.md');

    await writeFile(
      relativeChangesetPath,
      '---\n"create-lv48-app": patch\n---\n\nOld summary\n',
      'utf8',
    );

    const { stdout } = await runSyncPrChangeset(workspaceRoot, {
      PR_NUMBER: '42',
      PR_TITLE: 'No release required',
      PR_LABELS_JSON: JSON.stringify(['release:none']),
    });

    assert.match(stdout, /Removed managed changeset/);
    await assert.rejects(readFile(relativeChangesetPath, 'utf8'));
  });
});

async function runSyncPrChangeset(workspaceRoot: string, env: Record<string, string>) {
  return execFileAsync('node', [path.join(process.cwd(), 'scripts', 'syncPrChangeset.mjs')], {
    cwd: workspaceRoot,
    env: {
      ...process.env,
      ...env,
    },
  });
}

async function createReleaseAutomationFixture() {
  const workspaceRoot = await mkdtemp(path.join(os.tmpdir(), 'lv48-release-automation-'));

  cleanupPaths.push(workspaceRoot);

  await mkdir(path.join(workspaceRoot, '.github'), { recursive: true });
  await mkdir(path.join(workspaceRoot, '.changeset'), { recursive: true });
  await writeFile(
    path.join(workspaceRoot, 'package.json'),
    JSON.stringify({
      name: 'create-lv48-app',
    }),
    'utf8',
  );
  await writeFile(
    path.join(workspaceRoot, '.github', 'releaseAutomation.json'),
    JSON.stringify({
      defaultBranch: 'main',
      releaseLabels: {
        'release:none': 'none',
        'release:patch': 'patch',
        'release:minor': 'minor',
        'release:major': 'major',
      },
      managedChangeset: {
        directory: '.changeset',
        filenamePrefix: 'release-pr-',
        filenameTemplate: 'release-pr-<number>.md',
        summarySource: 'pull_request.title',
        removeWhenLabelMissing: true,
      },
    }),
    'utf8',
  );

  return workspaceRoot;
}
