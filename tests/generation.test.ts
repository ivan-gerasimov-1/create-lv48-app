import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it } from 'node:test';

import { createPlaceholderValues } from '../src/cli/placeholders.js';
import { createGenerationRunner } from '../src/generate/index.js';
import { createPresetRegistry } from '../src/presets/index.js';
import { createTransformPipeline } from '../src/transforms/index.js';
import {
  listRelativeDirectories,
  listRelativeFiles,
  pathExists,
  readUtf8File,
  removePaths,
} from '../src/utils/fs.js';
import { assertContains, assertNotContains, assertRejects } from './helpers.js';

let cleanupPaths: string[] = [];

afterEach(async () => {
  await removePaths(cleanupPaths);
  cleanupPaths.length = 0;
});

describe('generation', () => {
  it('exposes the default preset id', () => {
    assert.equal(createPresetRegistry().defaultPresetId, 'base');
  });

  it('builds placeholder values for package-specific template keys', () => {
    assert.deepEqual(
      createPlaceholderValues({
        projectName: 'demo-app',
        packageName: 'demo-app',
        displayName: 'Demo App',
        targetDirectory: 'demo-app',
        packageManager: 'npm',
        presetId: 'base',
        installDependencies: true,
        initializeGit: true,
      }),
      {
      projectName: 'demo-app',
      packageName: 'demo-app',
      displayName: 'Demo App',
      targetDirectory: 'demo-app',
      webPackageName: '@demo-app/web',
      sitePackageName: '@demo-app/site',
      apiPackageName: '@demo-app/api',
      },
    );
  });

  it('loads the base preset metadata from the registry', () => {
    let registry = createPresetRegistry();

    assert.deepEqual(registry.getDefaultPreset(), {
      id: 'base',
      displayName: 'Base SaaS Monorepo',
      description: 'Baseline npm-workspaces monorepo for TS-first SaaS projects.',
      packageManagers: ['npm'],
      templateDirectory: 'templates/base',
      reservedDirectories: ['packages'],
      placeholderKeys: [
        'projectName',
        'packageName',
        'displayName',
        'targetDirectory',
        'webPackageName',
        'sitePackageName',
        'apiPackageName',
      ],
      postGeneration: {
        installDependencies: true,
        initializeGit: true,
      },
    });
  });

  it('checks target directory conflicts before generation', async () => {
    let rootDirectory = await mkdtemp(path.join(os.tmpdir(), 'lv48-preflight-'));
    let targetRoot = path.join(rootDirectory, 'existing-target');

    cleanupPaths.push(rootDirectory);
    await mkdir(targetRoot, { recursive: true });
    await writeFile(path.join(targetRoot, 'keep.txt'), 'existing', 'utf8');

    let runner = createGenerationRunner(createTransformPipeline());

    await assertRejects(
      runner.prepare({
        cwd: rootDirectory,
        templateBaseDirectory: process.cwd(),
        targetRoot,
        answers: {
          projectName: 'demo-app',
          packageName: 'demo-app',
          displayName: 'Demo App',
          targetDirectory: 'existing-target',
          packageManager: 'npm',
          presetId: 'base',
          installDependencies: true,
          initializeGit: true,
        },
        preset: {
          id: 'base',
          displayName: 'Fixture',
          description: 'Fixture',
          packageManagers: ['npm'],
          templateDirectory: 'templates/base',
          reservedDirectories: ['packages'],
          placeholderKeys: ['projectName', 'packageName', 'displayName', 'targetDirectory'],
          postGeneration: {
            installDependencies: true,
            initializeGit: true,
          },
        },
        placeholders: {
          projectName: 'demo-app',
          packageName: 'demo-app',
          displayName: 'Demo App',
          targetDirectory: 'existing-target',
        },
      }),
      'Target directory existing-target already contains files that would conflict with the scaffold.',
    );
  });

  it('copies template files, renames special files, interpolates placeholders, and transforms package manifests', async () => {
    let rootDirectory = await mkdtemp(path.join(os.tmpdir(), 'lv48-scaffold-'));
    let targetRoot = path.join(rootDirectory, 'generated-app');

    cleanupPaths.push(rootDirectory);

    let runner = createGenerationRunner(createTransformPipeline());
    let preset = {
      id: 'base' as const,
      displayName: 'Fixture',
      description: 'Fixture',
      packageManagers: ['npm' as const],
      templateDirectory: 'tests/fixtures/pipelineTemplate',
      reservedDirectories: ['packages'],
      placeholderKeys: ['projectName', 'packageName', 'displayName', 'targetDirectory'],
      postGeneration: {
        installDependencies: true,
        initializeGit: true,
      },
    };

    let context = {
      cwd: process.cwd(),
      templateBaseDirectory: process.cwd(),
      targetRoot,
      answers: {
        projectName: 'demo-app',
        packageName: 'demo-app',
        displayName: 'Demo App',
        targetDirectory: 'generated-app',
        packageManager: 'npm' as const,
        presetId: 'base' as const,
        installDependencies: true,
        initializeGit: true,
      },
      preset,
      placeholders: {
        projectName: 'demo-app',
        packageName: 'demo-app',
        displayName: 'Demo App',
        targetDirectory: 'generated-app',
      },
    };

    await runner.prepare(context);

    let record = await runner.scaffold(context);

    assert.equal(record.createdFiles.length, 4);
    assertContains(await listRelativeDirectories(targetRoot), 'packages');
    assertNotContains(await listRelativeDirectories(targetRoot), '_meta');
    assert.deepEqual(await listRelativeFiles(targetRoot), [
      '.gitignore',
      'README.md',
      'package.json',
      'packages/sample/package.json',
    ]);
    assert.equal(await readUtf8File(path.join(targetRoot, 'README.md')), '# Demo App\n');
    assert.equal(await readUtf8File(path.join(targetRoot, '.gitignore')), 'node_modules\n');
    assertContains(
      await readUtf8File(path.join(targetRoot, 'package.json')),
      '"name": "demo-app"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'packages/sample/package.json')),
      '"name": "@demo-app/sample"',
    );
  });

  it('rolls back created scaffold paths when generation fails before handoff', async () => {
    let rootDirectory = await mkdtemp(path.join(os.tmpdir(), 'lv48-rollback-'));
    let targetRoot = path.join(rootDirectory, 'broken-app');

    cleanupPaths.push(rootDirectory);
    await mkdir(path.join(rootDirectory, 'fixture'), { recursive: true });
    await writeFile(path.join(rootDirectory, 'fixture', 'README.md'), '# {{displayName}}\n', 'utf8');
    await writeFile(path.join(rootDirectory, 'fixture', 'package.json'), '{invalid-json}\n', 'utf8');

    let runner = createGenerationRunner(createTransformPipeline());

    await assertRejects(
      runner.scaffold({
        cwd: rootDirectory,
        templateBaseDirectory: rootDirectory,
        targetRoot,
        answers: {
          projectName: 'demo-app',
          packageName: 'demo-app',
          displayName: 'Demo App',
          targetDirectory: 'broken-app',
          packageManager: 'npm',
          presetId: 'base',
          installDependencies: true,
          initializeGit: true,
        },
        preset: {
          id: 'base',
          displayName: 'Fixture',
          description: 'Fixture',
          packageManagers: ['npm'],
          templateDirectory: 'fixture',
          reservedDirectories: ['packages'],
          placeholderKeys: ['projectName', 'packageName', 'displayName', 'targetDirectory'],
          postGeneration: {
            installDependencies: true,
            initializeGit: true,
          },
        },
        placeholders: {
          projectName: 'demo-app',
          packageName: 'demo-app',
          displayName: 'Demo App',
          targetDirectory: 'broken-app',
        },
      }),
    );

    assert.deepEqual(await listRelativeFiles(rootDirectory), [
      'fixture/README.md',
      'fixture/package.json',
    ]);
  });

  it('preserves an existing empty target directory when rollback runs', async () => {
    let rootDirectory = await mkdtemp(path.join(os.tmpdir(), 'lv48-existing-target-'));
    let targetRoot = path.join(rootDirectory, 'existing-target');

    cleanupPaths.push(rootDirectory);
    await mkdir(targetRoot, { recursive: true });
    await mkdir(path.join(rootDirectory, 'fixture'), { recursive: true });
    await writeFile(path.join(rootDirectory, 'fixture', 'README.md'), '# {{displayName}}\n', 'utf8');
    await writeFile(path.join(rootDirectory, 'fixture', 'package.json'), '{invalid-json}\n', 'utf8');

    let runner = createGenerationRunner(createTransformPipeline());

    await assertRejects(
      runner.scaffold({
        cwd: rootDirectory,
        templateBaseDirectory: rootDirectory,
        targetRoot,
        answers: {
          projectName: 'demo-app',
          packageName: 'demo-app',
          displayName: 'Demo App',
          targetDirectory: 'existing-target',
          packageManager: 'npm',
          presetId: 'base',
          installDependencies: true,
          initializeGit: true,
        },
        preset: {
          id: 'base',
          displayName: 'Fixture',
          description: 'Fixture',
          packageManagers: ['npm'],
          templateDirectory: 'fixture',
          reservedDirectories: ['packages'],
          placeholderKeys: ['projectName', 'packageName', 'displayName', 'targetDirectory'],
          postGeneration: {
            installDependencies: true,
            initializeGit: true,
          },
        },
        placeholders: {
          projectName: 'demo-app',
          packageName: 'demo-app',
          displayName: 'Demo App',
          targetDirectory: 'existing-target',
        },
      }),
    );

    assert.ok(await pathExists(targetRoot), 'Existing empty target directory should survive rollback');
    assert.deepEqual(await listRelativeFiles(rootDirectory), [
      'fixture/README.md',
      'fixture/package.json',
    ]);
  });

  it('scaffolds the real base preset with correct structural invariants', async () => {
    let rootDirectory = await mkdtemp(path.join(os.tmpdir(), 'lv48-base-preset-'));
    let targetRoot = path.join(rootDirectory, 'demo-app');
    let preset = createPresetRegistry().getDefaultPreset();
    let answers = {
      projectName: 'demo-app',
      packageName: 'demo-app',
      displayName: 'Demo App',
      targetDirectory: 'demo-app',
      packageManager: 'npm' as const,
      presetId: 'base' as const,
      installDependencies: false,
      initializeGit: false,
    };

    cleanupPaths.push(rootDirectory);

    let runner = createGenerationRunner(createTransformPipeline());
    let context = {
      cwd: process.cwd(),
      templateBaseDirectory: process.cwd(),
      targetRoot,
      answers,
      preset,
      placeholders: createPlaceholderValues(answers),
    };

    await runner.prepare(context);
    let record = await runner.scaffold(context);

    assert.ok(record.createdFiles.length > 0, 'Should create at least one file');

    let rootPkg = JSON.parse(await readUtf8File(path.join(targetRoot, 'package.json')));
    assert.equal(rootPkg.name, 'demo-app', 'Root package.json name from placeholder');
    assert.equal(rootPkg.packageManager, 'npm', 'Root package.json packageManager');

    let directories = await listRelativeDirectories(targetRoot);
    assertContains(directories, 'packages');
    assertNotContains(directories, '_meta');

    let files = await listRelativeFiles(targetRoot);
    assertContains(files, '.gitignore');
    assertContains(files, 'package.json');
    assertNotContains(files, '_gitignore');

    for (let file of files) {
      let contents = await readUtf8File(path.join(targetRoot, file));
      assert.ok(!contents.includes('{{'), `Unresolved placeholder in ${file}`);
    }

    let webPkg = JSON.parse(await readUtf8File(path.join(targetRoot, 'apps/web/package.json')));
    assert.equal(webPkg.name, '@demo-app/web', 'Workspace package scoped name');

    let sitePkg = JSON.parse(await readUtf8File(path.join(targetRoot, 'apps/site/package.json')));
    assert.equal(sitePkg.name, '@demo-app/site', 'Workspace package scoped name');

    let apiPkg = JSON.parse(await readUtf8File(path.join(targetRoot, 'apps/api/package.json')));
    assert.equal(apiPkg.name, '@demo-app/api', 'Workspace package scoped name');

    assertContains(
      await readUtf8File(path.join(targetRoot, 'README.md')),
      'Demo App',
    );
  });
});
