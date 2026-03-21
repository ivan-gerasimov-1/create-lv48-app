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

  it('scaffolds the real base preset and verifies the generated baseline tree', async () => {
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
    await runner.scaffold(context);

    assert.deepEqual(await listRelativeFiles(targetRoot), [
      '.env.example',
      '.gitignore',
      'README.md',
      'apps/api/README.md',
      'apps/api/package.json',
      'apps/api/src/index.ts',
      'apps/site/README.md',
      'apps/site/astro.config.mjs',
      'apps/site/package.json',
      'apps/site/src/pages/index.astro',
      'apps/web/README.md',
      'apps/web/components.json',
      'apps/web/index.html',
      'apps/web/package.json',
      'apps/web/src/App.tsx',
      'apps/web/src/components/ui/button.tsx',
      'apps/web/src/index.css',
      'apps/web/src/lib/utils.ts',
      'apps/web/src/main.tsx',
      'apps/web/tsconfig.json',
      'apps/web/vite.config.ts',
      'package.json',
    ]);
    assertContains(await listRelativeDirectories(targetRoot), 'packages');
    assertNotContains(await listRelativeDirectories(targetRoot), '_meta');
    assertContains(
      await readUtf8File(path.join(targetRoot, 'README.md')),
      'apps/web',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'README.md')),
      'Tailwind CSS v4',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'package.json')),
      '"workspaces"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'package.json')),
      '"build": "npm run build --workspaces --if-present"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'package.json')),
      '"node": ">=24.0.0"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/index.html')),
      '/src/main.tsx',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/package.json')),
      '"@tailwindcss/vite"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/package.json')),
      '"tailwindcss"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/package.json')),
      '"clsx"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/package.json')),
      '"react"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/package.json')),
      '"vite"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/package.json')),
      '"node": ">=24.0.0"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/src/main.tsx')),
      "ReactDOM.createRoot",
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/src/main.tsx')),
      "./index.css",
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/src/App.tsx')),
      'Tailwind CSS v4 + shadcn-ready',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/src/App.tsx')),
      'Demo App',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/src/App.tsx')),
      'demo-app',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/README.md')),
      'Demo App',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/src/index.css')),
      '@import "tailwindcss";',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/src/index.css')),
      '@theme inline',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/src/components/ui/button.tsx')),
      'buttonVariants',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/src/lib/utils.ts')),
      'tailwind-merge',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/components.json')),
      '"css": "src/index.css"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/components.json')),
      '"components": "@/components"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/tsconfig.json')),
      '"@/*"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/vite.config.ts')),
      "tailwindcss()",
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/web/vite.config.ts')),
      "new URL('./src', import.meta.url)",
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/site/astro.config.mjs')),
      'defineConfig',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/site/package.json')),
      '"astro"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/site/package.json')),
      '"node": ">=24.0.0"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/site/src/pages/index.astro')),
      'Astro starter site',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/api/package.json')),
      '"hono"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/api/package.json')),
      '"node": ">=24.0.0"',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'apps/api/src/index.ts')),
      "new Hono()",
    );
    assert.deepEqual(await listRelativeFiles(path.join(targetRoot, 'packages')), []);
    assert.deepEqual(await listRelativeDirectories(path.join(targetRoot, 'packages')), []);
    assertNotContains(
      await readUtf8File(path.join(targetRoot, '.gitignore')),
      '.turbo',
    );
    assertContains(
      await readUtf8File(path.join(targetRoot, 'README.md')),
      'Node.js 24 or newer',
    );
  });
});
