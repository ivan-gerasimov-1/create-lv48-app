import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createPromptController } from '../src/prompts/index.js';
import {
  validatePackageName,
  validateProjectName,
  validateTargetDirectory,
} from '../src/utils/validation.js';
import { createPromptIoMock } from './helpers.js';

describe('prompts', () => {
  it('collects phase 1 prompt answers without package manager or preset prompts', async () => {
    let controller = createPromptController(createPromptIoMock());

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
});
