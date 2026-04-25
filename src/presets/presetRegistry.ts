import { baseTemplate } from "#/templates/base/template";

import type { TPresetMetadata, TPresetRegistry } from "./types";

export function createPresetRegistry(): TPresetRegistry {
  let defaultPreset: TPresetMetadata = {
    name: baseTemplate.name,
    displayName: baseTemplate.displayName,
    description: baseTemplate.description,
    packageManagers: baseTemplate.packageManagers,
    reservedDirectories: baseTemplate.reservedDirectories,
    placeholderKeys: baseTemplate.placeholderKeys,
    postGeneration: baseTemplate.postGeneration,
  };

  return {
    defaultPresetName: "base",
    getDefaultPreset() {
      return defaultPreset;
    },
    getPresetByName(presetName) {
      if (presetName !== "base") {
        throw new Error(`Unknown preset: ${presetName}`);
      }

      return defaultPreset;
    },
  };
}

export type { TPresetMetadata, TPresetRegistry };
