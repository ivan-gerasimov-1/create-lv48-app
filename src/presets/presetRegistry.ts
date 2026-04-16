import { baseTemplate } from "../../templates/base/template.js";
import type { TPresetMetadata, TPresetRegistry } from "./types.js";

export function createPresetRegistry(): TPresetRegistry {
  let defaultPreset: TPresetMetadata = {
    id: baseTemplate.id,
    displayName: baseTemplate.displayName,
    description: baseTemplate.description,
    packageManagers: baseTemplate.packageManagers,
    reservedDirectories: baseTemplate.reservedDirectories,
    placeholderKeys: baseTemplate.placeholderKeys,
    postGeneration: baseTemplate.postGeneration,
  };

  return {
    defaultPresetId: "base",
    getDefaultPreset() {
      return defaultPreset;
    },
    getPresetById(presetId) {
      if (presetId !== "base") {
        throw new Error(`Unknown preset: ${presetId}`);
      }

      return defaultPreset;
    },
  };
}

export type { TPresetMetadata, TPresetRegistry };
