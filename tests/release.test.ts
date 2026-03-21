import assert from 'node:assert/strict';
import path from 'node:path';
import { afterEach, describe, it } from 'node:test';

import { createReleaseSmokePaths, getInstalledSmokeCliPath } from '../src/release/smoke.js';
import { verifyPackedFiles } from '../src/release/verifyPack.js';
import { readUtf8File, removePaths } from '../src/utils/fs.js';
import { assertContains } from './helpers.js';

const CONTRACT_FILES = [
  'LICENSE',
  'README.md',
  'bin/create-lv48-app.js',
  'dist/cli.d.ts',
  'dist/cli.js',
  'dist/cli.js.map',
  'dist/generate/index.js',
  'dist/presets/index.js',
  'dist/prompts/index.js',
  'dist/transforms/index.js',
  'dist/utils/fs.js',
  'package.json',
  'templates/base/_meta/template.json',
  'templates/base/README.md',
  'templates/base/apps/api/package.json',
  'templates/base/apps/site/package.json',
  'templates/base/apps/web/package.json',
  'templates/base/package.json',
].sort();

let cleanupPaths: string[] = [];

afterEach(async () => {
  await removePaths(cleanupPaths);
  cleanupPaths.length = 0;
});

describe('release', () => {
  it('publishes template assets with the package for runtime scaffold access', async () => {
    let packageManifest = await readUtf8File(path.join(process.cwd(), 'package.json'));
    let parsedManifest = JSON.parse(packageManifest);

    assert.equal(parsedManifest.license, 'MIT');
    assert.deepEqual(parsedManifest.files, ['bin', 'dist', 'templates']);
    assert.deepEqual(parsedManifest.publishConfig, { access: 'public' });
    assert.deepEqual(parsedManifest.repository, {
      type: 'git',
      url: 'git+https://github.com/ivan-gerasimov-1/create-lv48-app.git',
    });
    assert.equal(parsedManifest.homepage, 'https://github.com/ivan-gerasimov-1/create-lv48-app#readme');
    assert.deepEqual(parsedManifest.bugs, {
      url: 'https://github.com/ivan-gerasimov-1/create-lv48-app/issues',
    });
    assert.deepEqual(parsedManifest.bin, {
      'create-lv48-app': 'bin/create-lv48-app.js',
    });
    assert.deepEqual(parsedManifest.engines, {
      node: '>=24',
    });
    assertContains(packageManifest, '"templates"');
    assertContains(await readUtf8File(path.join(process.cwd(), 'LICENSE')), 'MIT License');
  });

  it('verifyPackedFiles accepts a valid packed file manifest matching the public contract', () => {
    let files = [
      { path: 'package/LICENSE' },
      { path: 'package/README.md' },
      { path: 'package/bin/create-lv48-app.js' },
      { path: 'package/dist/cli.d.ts' },
      { path: 'package/dist/cli.js' },
      { path: 'package/dist/cli.js.map' },
      { path: 'package/dist/generate/index.js' },
      { path: 'package/dist/presets/index.js' },
      { path: 'package/dist/prompts/index.js' },
      { path: 'package/dist/transforms/index.js' },
      { path: 'package/dist/utils/fs.js' },
      { path: 'package/package.json' },
      { path: 'package/templates/base/_meta/template.json' },
      { path: 'package/templates/base/README.md' },
      { path: 'package/templates/base/apps/api/package.json' },
      { path: 'package/templates/base/apps/site/package.json' },
      { path: 'package/templates/base/apps/web/package.json' },
      { path: 'package/templates/base/package.json' },
    ];

    let result = verifyPackedFiles(files, CONTRACT_FILES);

    assert.deepEqual(result.missingFiles, []);
    assert.deepEqual(result.unexpectedFiles, []);
  });

  it('flags unexpected packed files outside the public contract', () => {
    let result = verifyPackedFiles(
      [
        { path: 'package/bin/create-lv48-app.js' },
        { path: 'package/dist/cli.js' },
        { path: 'package/src/cli.ts' },
      ],
      CONTRACT_FILES,
    );

    assert.deepEqual(result.unexpectedFiles, ['src/cli.ts']);
    assert.ok(result.missingFiles.length > 0, 'Partial input should report missing files');
    assert.ok(result.missingFiles.includes('LICENSE'), 'Missing LICENSE should be reported');
  });

  it('creates isolated directories for packed-artifact smoke verification', async () => {
    let smokePaths = await createReleaseSmokePaths();

    cleanupPaths.push(smokePaths.workspaceRoot);

    assert.equal(smokePaths.generatedProjectRoot,
      path.join(smokePaths.runDirectory, 'smoke-app'),
    );
    assert.equal(getInstalledSmokeCliPath(smokePaths.installDirectory, 'linux'),
      path.join(smokePaths.installDirectory, 'node_modules', '.bin', 'create-lv48-app'),
    );
    assert.equal(getInstalledSmokeCliPath(smokePaths.installDirectory, 'win32'),
      path.join(smokePaths.installDirectory, 'node_modules', '.bin', 'create-lv48-app.cmd'),
    );
    assertContains(
      await readUtf8File(path.join(process.cwd(), 'package.json')),
      '"release:smoke": "node ./scripts/releaseSmoke.mjs"',
    );
  });
});
