import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

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
      ],
      postGeneration: {
        installDependencies: true,
        initializeGit: true,
      },
    });
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
});
