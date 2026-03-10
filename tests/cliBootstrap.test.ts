import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it } from 'node:test';

import { buildInitializationSummary, formatInitializationSummary } from '../src/cli/summary.js';
import { createPlaceholderValues } from '../src/cli/placeholders.js';
import { createPostSetupExecutor } from '../src/cli/postSetup.js';
import { runCli } from '../src/cli.js';
import { createGenerationRunner } from '../src/generate/index.js';
import { createPresetRegistry } from '../src/presets/index.js';
import { createPromptController } from '../src/prompts/index.js';
import { createReleaseSmokePaths, getInstalledSmokeCliPath } from '../src/release/smoke.js';
import { getExpectedPackedFiles, verifyPackedFiles } from '../src/release/verifyPack.js';
import { createTransformPipeline } from '../src/transforms/index.js';
import {
  listRelativeDirectories,
  listRelativeFiles,
  readUtf8File,
  removePaths,
} from '../src/utils/fs.js';
import {
  validatePackageName,
  validateProjectName,
  validateTargetDirectory,
} from '../src/utils/validation.js';

function createPromptIoMock() {
  const answers = ['demo-app', 'demo-directory'];
  const confirmations = [true, false];

  return {
    async askText() {
      const value = answers.shift();

      if (typeof value !== 'string') {
        throw new Error('Missing text answer');
      }

      return value;
    },
    async askConfirm() {
      const value = confirmations.shift();

      if (typeof value !== 'boolean') {
        throw new Error('Missing confirm answer');
      }

      return value;
    },
    async close() {},
  };
}

const cleanupPaths: string[] = [];

function assertContains(container: readonly string[] | string, expected: string) {
  if (typeof container === 'string') {
    assert.ok(container.includes(expected));
    return;
  }

  assert.ok(container.includes(expected));
}

function assertNotContains(container: readonly string[] | string, expected: string) {
  if (typeof container === 'string') {
    assert.ok(!container.includes(expected));
    return;
  }

  assert.ok(!container.includes(expected));
}

async function assertRejects(action: Promise<unknown>, message?: string) {
  await assert.rejects(action, (error) => {
    assert.ok(error instanceof Error);

    if (typeof message === 'string') {
      assert.equal(error.message, message);
    }

    return true;
  });
}

afterEach(async () => {
  await removePaths(cleanupPaths);
  cleanupPaths.length = 0;
});

describe('bootstrap modules', () => {
  it('exposes phase 1 defaults', () => {
    assert.equal(createPromptController(createPromptIoMock()).phase, 'phase-1');
    assert.equal(createPresetRegistry().defaultPresetId, 'base');
    assert.equal(createTransformPipeline().mode, 'staged');
    assert.equal(createGenerationRunner(createTransformPipeline()).status, 'ready');
  });

  it('collects phase 1 prompt answers without package manager or preset prompts', async () => {
    const controller = createPromptController(createPromptIoMock());

    assert.deepEqual(await controller.collectAnswers('fallback-name'), {
      projectName: 'demo-app',
      packageName: 'demo-app',
      displayName: 'Demo App',
      targetDirectory: 'demo-directory',
      packageManager: 'npm',
      presetId: 'base',
      installDependencies: true,
      initializeGit: false,
    });
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

  it('validates project, package, and target directory inputs', () => {
    assert.deepEqual(validateProjectName('demo-app'), { ok: true, value: 'demo-app' });
    assert.deepEqual(validatePackageName('demo-app'), { ok: true, value: 'demo-app' });
    assert.deepEqual(validateTargetDirectory('apps/demo'), {
      ok: true,
      value: 'apps/demo',
    });
    assert.deepEqual(validateProjectName('Demo App'), {
      ok: false,
      reason:
        'Project name must use lowercase letters, numbers, and single hyphens only.',
    });
    assert.deepEqual(validateTargetDirectory('../demo'), {
      ok: false,
      reason: 'Target directory must stay within the current working directory.',
    });
  });

  it('loads the base preset metadata from the registry', () => {
    const registry = createPresetRegistry();

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

  it('publishes template assets with the package for runtime scaffold access', async () => {
    const packageManifest = await readUtf8File(path.join(process.cwd(), 'package.json'));
    const parsedManifest = JSON.parse(packageManifest) as {
      license: string;
      files: string[];
      publishConfig: { access: string };
      repository: { type: string; url: string };
      homepage: string;
      bugs: { url: string };
      bin: Record<string, string>;
      engines: { node: string };
    };

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
      node: '>=24.0.0',
    });
    assertContains(packageManifest, '"templates"');
    assertContains(await readUtf8File(path.join(process.cwd(), 'LICENSE')), 'MIT License');
  });

  it('verifies packed artifact paths against the public file contract', () => {
    const result = verifyPackedFiles(
      getExpectedPackedFiles().map((filePath) => ({
        path: filePath,
      })),
    );

    assert.deepEqual(result.missingFiles, []);
    assert.deepEqual(result.unexpectedFiles, []);
  });

  it('flags unexpected packed files outside the public contract', () => {
    const result = verifyPackedFiles([
      { path: 'package/bin/create-lv48-app.js' },
      { path: 'package/dist/cli.js' },
      { path: 'package/src/cli.ts' },
    ]);

    assert.deepEqual(result.unexpectedFiles, ['src/cli.ts']);
  });

  it('documents changesets-driven release workflows with OIDC permissions', async () => {
    const publishWorkflowContents = await readFile(
      path.join(process.cwd(), '.github/workflows/publish.yml'),
      'utf8',
    );
    const prWorkflowContents = await readFile(
      path.join(process.cwd(), '.github/workflows/prReleaseChangeset.yml'),
      'utf8',
    );
    const packageManifest = await readUtf8File(path.join(process.cwd(), 'package.json'));
    const releaseAutomationConfig = await readUtf8File(
      path.join(process.cwd(), '.github/releaseAutomation.json'),
    );

    assertContains(publishWorkflowContents, 'push:');
    assertContains(publishWorkflowContents, 'id-token: write');
    assertContains(publishWorkflowContents, 'pull-requests: write');
    assertContains(publishWorkflowContents, 'uses: changesets/action@v1');
    assertContains(publishWorkflowContents, 'version: npm run release:version');
    assertContains(publishWorkflowContents, 'publish: npm run release:publish');
    assertContains(publishWorkflowContents, 'NPM_CONFIG_PROVENANCE: false');
    assertContains(prWorkflowContents, 'pull_request:');
    assertContains(prWorkflowContents, 'run: node ./scripts/validateForkReleasePolicy.mjs');
    assertContains(prWorkflowContents, 'run: node ./scripts/syncPrChangeset.mjs');
    assertContains(prWorkflowContents, 'git add -A ".changeset/release-pr-${PR_NUMBER}.md"');
    assertContains(packageManifest, '"release:version": "changeset version"');
    assertContains(packageManifest, '"release:publish": "node ./scripts/releasePublish.mjs"');
    assertContains(packageManifest, '"release:validate-workflow": "node ./scripts/validatePublishWorkflow.mjs"');
    assertContains(releaseAutomationConfig, '"release:none": "none"');
  });

  it('creates isolated directories for packed-artifact smoke verification', async () => {
    const smokePaths = await createReleaseSmokePaths();
    const releaseSmokeScript = await readUtf8File(
      path.join(process.cwd(), 'scripts/releaseSmoke.mjs'),
    );

    cleanupPaths.push(smokePaths.workspaceRoot);

    assert.equal(smokePaths.generatedProjectRoot,
      path.join(smokePaths.runDirectory, 'smoke-app'),
    );
    assertContains(releaseSmokeScript, 'getInstalledSmokeCliPath');
    assert.equal(getInstalledSmokeCliPath(smokePaths.installDirectory, 'linux'),
      path.join(smokePaths.installDirectory, 'node_modules', '.bin', 'create-lv48-app'),
    );
    assert.equal(getInstalledSmokeCliPath(smokePaths.installDirectory, 'win32'),
      path.join(smokePaths.installDirectory, 'node_modules', '.bin', 'create-lv48-app.cmd'),
    );
    assertContains(releaseSmokeScript, "projectName: 'smoke-app'");
    assertContains(releaseSmokeScript, 'await scaffoldFromInstalledPackage');
    assertContains(
      await readUtf8File(path.join(process.cwd(), 'package.json')),
      '"release:smoke": "node ./scripts/releaseSmoke.mjs"',
    );
  });

  it('checks target directory conflicts before generation', async () => {
    const rootDirectory = await mkdtemp(path.join(os.tmpdir(), 'lv48-preflight-'));
    const targetRoot = path.join(rootDirectory, 'existing-target');

    cleanupPaths.push(rootDirectory);
    await mkdir(targetRoot, { recursive: true });
    await writeFile(path.join(targetRoot, 'keep.txt'), 'existing', 'utf8');

    const runner = createGenerationRunner(createTransformPipeline());

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
    const rootDirectory = await mkdtemp(path.join(os.tmpdir(), 'lv48-scaffold-'));
    const targetRoot = path.join(rootDirectory, 'generated-app');

    cleanupPaths.push(rootDirectory);

    const runner = createGenerationRunner(createTransformPipeline());
    const preset = {
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

    const context = {
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

    assert.deepEqual(await runner.prepare(context), {
      targetRoot,
      isEmpty: true,
    });

    const record = await runner.scaffold(context);

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
    const rootDirectory = await mkdtemp(path.join(os.tmpdir(), 'lv48-rollback-'));
    const targetRoot = path.join(rootDirectory, 'broken-app');

    cleanupPaths.push(rootDirectory);
    await mkdir(path.join(rootDirectory, 'fixture'), { recursive: true });
    await writeFile(path.join(rootDirectory, 'fixture', 'README.md'), '# {{displayName}}\n', 'utf8');
    await writeFile(path.join(rootDirectory, 'fixture', 'package.json'), '{invalid-json}\n', 'utf8');

    const runner = createGenerationRunner(createTransformPipeline());

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
    const rootDirectory = await mkdtemp(path.join(os.tmpdir(), 'lv48-existing-target-'));
    const targetRoot = path.join(rootDirectory, 'existing-target');

    cleanupPaths.push(rootDirectory);
    await mkdir(targetRoot, { recursive: true });
    await mkdir(path.join(rootDirectory, 'fixture'), { recursive: true });
    await writeFile(path.join(rootDirectory, 'fixture', 'README.md'), '# {{displayName}}\n', 'utf8');
    await writeFile(path.join(rootDirectory, 'fixture', 'package.json'), '{invalid-json}\n', 'utf8');

    const runner = createGenerationRunner(createTransformPipeline());

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

    assert.deepEqual(await listRelativeFiles(rootDirectory), [
      'fixture/README.md',
      'fixture/package.json',
    ]);
  });

  it('initializes git repositories on the main branch when git supports the initial branch flag', async () => {
    const executed: string[] = [];
    const executor = createPostSetupExecutor(async (command, args, cwd) => {
      executed.push(`${command} ${args.join(' ')} @ ${cwd}`);
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

    assert.deepEqual(executed, [
      'git init --initial-branch=main @ /tmp/demo-app',
    ]);
  });

  it('falls back to a compatible main-branch setup when git does not support the initial branch flag', async () => {
    const executed: string[] = [];
    const executor = createPostSetupExecutor(async (command, args, cwd) => {
      executed.push(`${command} ${args.join(' ')} @ ${cwd}`);

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

    assert.deepEqual(executed, [
      'git init --initial-branch=main @ /tmp/demo-app',
      'git init @ /tmp/demo-app',
      'git symbolic-ref HEAD refs/heads/main @ /tmp/demo-app',
    ]);
  });

  it('runs optional post-setup actions and reports failures without hiding scaffold success', async () => {
    const executed: string[] = [];
    const executor = createPostSetupExecutor(async (command, args, cwd) => {
      executed.push(`${command} ${args.join(' ')} @ ${cwd}`);

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

    assert.deepEqual(executed, [
      'npm install @ /tmp/demo-app',
      'git init --initial-branch=main @ /tmp/demo-app',
    ]);
  });

  it('emits progress messages before running each selected post-setup action', async () => {
    const started: string[] = [];
    const executor = createPostSetupExecutor(async () => {});

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
    const summary = buildInitializationSummary({
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

  it('scaffolds the real base preset and verifies the generated baseline tree', async () => {
    const rootDirectory = await mkdtemp(path.join(os.tmpdir(), 'lv48-base-preset-'));
    const targetRoot = path.join(rootDirectory, 'demo-app');
    const preset = createPresetRegistry().getDefaultPreset();
    const answers = {
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

    const runner = createGenerationRunner(createTransformPipeline());
    const context = {
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

  it('runs the full CLI flow and prints a final summary', async () => {
    const rootDirectory = await mkdtemp(path.join(os.tmpdir(), 'lv48-cli-run-'));
    const messages: string[] = [];

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
    assert.ok(messages.some((message) => message.includes('Post-setup:')));
    assertContains(
      await listRelativeFiles(path.join(rootDirectory, 'demo-directory')),
      'apps/web/src/main.tsx',
    );
  });
});
