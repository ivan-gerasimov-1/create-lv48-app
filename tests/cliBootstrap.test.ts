import { describe, expect, it } from 'vitest';

import { createGenerationRunner } from '../src/generate/index.js';
import { createPresetRegistry } from '../src/presets/index.js';
import { createPromptController } from '../src/prompts/index.js';
import { createTransformPipeline } from '../src/transforms/index.js';
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

describe('bootstrap modules', () => {
  it('exposes phase 1 defaults', () => {
    expect(createPromptController(createPromptIoMock()).phase).toBe('phase-1');
    expect(createPresetRegistry().defaultPresetId).toBe('base');
    expect(createTransformPipeline()).toEqual({ mode: 'staged' });
    expect(createGenerationRunner()).toEqual({ status: 'idle' });
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
});
