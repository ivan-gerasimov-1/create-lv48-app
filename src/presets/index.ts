import { loadBasePresetMetadata } from './base/loadBasePresetMetadata.js';
import type { PresetMetadata, PresetRegistry } from './types.js';

export function createPresetRegistry(): PresetRegistry {
  const defaultPreset = loadBasePresetMetadata();

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

export type { PresetMetadata, PresetRegistry };
