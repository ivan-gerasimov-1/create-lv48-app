import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { buildInitializationSummary, formatInitializationSummary } from '../src/cli/summary.js';
import { createPlaceholderValues } from '../src/cli/placeholders.js';
import { createPostSetupExecutor } from '../src/cli/postSetup.js';
import { runCli } from '../src/cli.js';
import { createGenerationRunner } from '../src/generate/index.js';
import { createPresetRegistry } from '../src/presets/index.js';
import { createPromptController } from '../src/prompts/index.js';
import { createTransformPipeline } from '../src/transforms/index.js';
import { listRelativeFiles, readUtf8File, removePaths } from '../src/utils/fs.js';
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

afterEach(async () => {
  await removePaths(cleanupPaths);
  cleanupPaths.length = 0;
});

describe('bootstrap modules', () => {
  it('exposes phase 1 defaults', () => {
    expect(createPromptController(createPromptIoMock()).phase).toBe('phase-1');
    expect(createPresetRegistry().defaultPresetId).toBe('base');
    expect(createTransformPipeline().mode).toBe('staged');
    expect(createGenerationRunner(createTransformPipeline()).status).toBe('ready');
  });

  it('collects phase 1 prompt answers without package manager or preset prompts', async () => {
    const controller = createPromptController(createPromptIoMock());

    await expect(controller.collectAnswers('fallback-name')).resolves.toEqual({
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
    expect(
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
    ).toEqual({
      projectName: 'demo-app',
      packageName: 'demo-app',
      displayName: 'Demo App',
      targetDirectory: 'demo-app',
      webPackageName: '@demo-app/web',
      sitePackageName: '@demo-app/site',
      apiPackageName: '@demo-app/api',
    });
  });

  it('validates project, package, and target directory inputs', () => {
    expect(validateProjectName('demo-app')).toEqual({ ok: true, value: 'demo-app' });
    expect(validatePackageName('demo-app')).toEqual({ ok: true, value: 'demo-app' });
    expect(validateTargetDirectory('apps/demo')).toEqual({
      ok: true,
      value: 'apps/demo',
    });
    expect(validateProjectName('Demo App')).toEqual({
      ok: false,
      reason:
        'Project name must use lowercase letters, numbers, and single hyphens only.',
    });
    expect(validateTargetDirectory('../demo')).toEqual({
      ok: false,
      reason: 'Target directory must stay within the current working directory.',
    });
  });

  it('loads the base preset metadata from the registry', () => {
    const registry = createPresetRegistry();

    expect(registry.getDefaultPreset()).toEqual({
      id: 'base',
      displayName: 'Base SaaS Monorepo',
      description: 'Baseline npm-workspaces monorepo for TS-first SaaS projects.',
      packageManagers: ['npm'],
      templateDirectory: 'templates/base',
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

    expect(packageManifest).toContain('"templates"');
  });

  it('checks target directory conflicts before generation', async () => {
    const rootDirectory = await mkdtemp(path.join(os.tmpdir(), 'lv48-preflight-'));
    const targetRoot = path.join(rootDirectory, 'existing-target');

    cleanupPaths.push(rootDirectory);
    await mkdir(targetRoot, { recursive: true });
    await writeFile(path.join(targetRoot, 'keep.txt'), 'existing', 'utf8');

    const runner = createGenerationRunner(createTransformPipeline());

    await expect(
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
    ).rejects.toThrow(
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

    await expect(runner.prepare(context)).resolves.toEqual({
      targetRoot,
      isEmpty: true,
    });

    const record = await runner.scaffold(context);

    expect(record.createdFiles.length).toBe(4);
    await expect(listRelativeFiles(targetRoot)).resolves.toEqual([
      '.gitignore',
      'README.md',
      'package.json',
      'packages/sample/package.json',
    ]);
    await expect(readUtf8File(path.join(targetRoot, 'README.md'))).resolves.toBe('# Demo App\n');
    await expect(readUtf8File(path.join(targetRoot, '.gitignore'))).resolves.toBe('node_modules\n');
    await expect(readUtf8File(path.join(targetRoot, 'package.json'))).resolves.toContain(
      '"name": "demo-app"',
    );
    await expect(
      readUtf8File(path.join(targetRoot, 'packages/sample/package.json')),
    ).resolves.toContain('"name": "@demo-app/sample"');
  });

  it('runs optional post-setup actions and reports failures without hiding scaffold success', async () => {
    const executed: string[] = [];
    const executor = createPostSetupExecutor(async (command, args, cwd) => {
      executed.push(`${command} ${args.join(' ')} @ ${cwd}`);

      if (command === 'git') {
        throw new Error('git unavailable');
      }
    });

    await expect(
      executor.run({
        targetRoot: '/tmp/demo-app',
        installDependencies: true,
        initializeGit: true,
      }),
    ).resolves.toEqual([
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
    ]);

    expect(executed).toEqual([
      'npm install @ /tmp/demo-app',
      'git init @ /tmp/demo-app',
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

    expect(summary.nextSteps).toEqual([
      'cd demo-app',
      'Review the failed optional steps above and rerun them manually if needed.',
    ]);
    expect(formatInitializationSummary(summary)).toContain('installDependencies: FAILED');
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

    await expect(listRelativeFiles(targetRoot)).resolves.toEqual([
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
      'apps/web/index.html',
      'apps/web/package.json',
      'apps/web/src/App.tsx',
      'apps/web/src/main.tsx',
      'apps/web/vite.config.ts',
      'package.json',
      'packages/config/README.md',
      'packages/config/package.json',
      'packages/config/src/index.ts',
      'packages/types/README.md',
      'packages/types/package.json',
      'packages/types/src/index.ts',
      'packages/ui/README.md',
      'packages/ui/package.json',
      'packages/ui/src/index.ts',
      'packages/utils/README.md',
      'packages/utils/package.json',
      'packages/utils/src/index.ts',
    ]);
    await expect(readUtf8File(path.join(targetRoot, 'README.md'))).resolves.toContain(
      'apps/web',
    );
    await expect(readUtf8File(path.join(targetRoot, 'package.json'))).resolves.toContain(
      '"workspaces"',
    );
    await expect(readUtf8File(path.join(targetRoot, 'package.json'))).resolves.toContain(
      '"build": "npm run build --workspaces --if-present"',
    );
    await expect(readUtf8File(path.join(targetRoot, 'apps/web/index.html'))).resolves.toContain(
      '/src/main.tsx',
    );
    await expect(readUtf8File(path.join(targetRoot, 'apps/web/package.json'))).resolves.toContain(
      '"react"',
    );
    await expect(readUtf8File(path.join(targetRoot, 'apps/web/package.json'))).resolves.toContain(
      '"vite"',
    );
    await expect(readUtf8File(path.join(targetRoot, 'apps/web/src/main.tsx'))).resolves.toContain(
      "ReactDOM.createRoot",
    );
    await expect(readUtf8File(path.join(targetRoot, 'apps/web/src/App.tsx'))).resolves.toContain(
      'React + Vite baseline',
    );
    await expect(
      readUtf8File(path.join(targetRoot, 'apps/site/astro.config.mjs')),
    ).resolves.toContain('defineConfig');
    await expect(readUtf8File(path.join(targetRoot, 'apps/site/package.json'))).resolves.toContain(
      '"astro"',
    );
    await expect(
      readUtf8File(path.join(targetRoot, 'apps/site/src/pages/index.astro')),
    ).resolves.toContain('Astro starter site');
    await expect(readUtf8File(path.join(targetRoot, 'apps/api/package.json'))).resolves.toContain(
      '"hono"',
    );
    await expect(readUtf8File(path.join(targetRoot, 'apps/api/src/index.ts'))).resolves.toContain(
      "new Hono()",
    );
    await expect(
      readUtf8File(path.join(targetRoot, 'packages/config/src/index.ts')),
    ).resolves.toContain('APP_NAME');
    await expect(readUtf8File(path.join(targetRoot, 'packages/ui/src/index.ts'))).resolves.toContain(
      'ButtonLabel',
    );
    await expect(
      readUtf8File(path.join(targetRoot, 'packages/types/src/index.ts')),
    ).resolves.toContain("HealthStatus = 'ok'");
    await expect(
      readUtf8File(path.join(targetRoot, 'packages/utils/src/index.ts')),
    ).resolves.toContain('formatProjectName');
    await expect(readUtf8File(path.join(targetRoot, '.gitignore'))).resolves.not.toContain(
      '.turbo',
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

    expect(messages.some((message) => message.includes('create-lv48-app will scaffold'))).toBe(
      true,
    );
    expect(messages.some((message) => message.includes('Post-setup:'))).toBe(true);
    await expect(listRelativeFiles(path.join(rootDirectory, 'demo-directory'))).resolves.toContain(
      'apps/web/src/main.tsx',
    );
  });
});
