import { describe, expect, it } from 'vitest';

import { createGenerationRunner } from '../src/generate/index.js';
import { createPresetRegistry } from '../src/presets/index.js';
import { createPromptController } from '../src/prompts/index.js';
import { createTransformPipeline } from '../src/transforms/index.js';

describe('bootstrap modules', () => {
  it('exposes phase 1 defaults', () => {
    expect(createPromptController()).toEqual({ phase: 'phase-1' });
    expect(createPresetRegistry()).toEqual({ defaultPresetId: 'base' });
    expect(createTransformPipeline()).toEqual({ mode: 'staged' });
    expect(createGenerationRunner()).toEqual({ status: 'idle' });
  });
});
