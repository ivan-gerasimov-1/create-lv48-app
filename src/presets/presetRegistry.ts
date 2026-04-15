import { loadBasePresetMetadata } from './base/loadBasePresetMetadata.js';
import type { TPresetMetadata, TPresetRegistry } from './types.js';

export function createPresetRegistry(): TPresetRegistry {
  let defaultPreset = loadBasePresetMetadata();

  return {
    defaultPresetId: 'base',
    getDefaultPreset() {
      return defaultPreset;
    },
    getPresetById(presetId) {
      if (presetId !== 'base') {
        throw new Error(`Unknown preset: ${presetId}`);
      }

      return defaultPreset;
    },
  };
}

export type { TPresetMetadata, TPresetRegistry };
