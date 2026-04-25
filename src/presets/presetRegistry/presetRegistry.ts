import { baseTemplate } from "#/templates/base/template";
import type { TPresetMetadata } from "#/presets/types";

import type { IPresetRegistry } from "./types";

export class PresetRegistry implements IPresetRegistry {
  private readonly defaultPreset: TPresetMetadata = {
    name: baseTemplate.name,
    displayName: baseTemplate.displayName,
    description: baseTemplate.description,
    packageManagers: baseTemplate.packageManagers,
    reservedDirectories: baseTemplate.reservedDirectories,
    placeholderKeys: baseTemplate.placeholderKeys,
    postGeneration: baseTemplate.postGeneration,
  };

  public getDefaultPreset(): TPresetMetadata {
    return this.defaultPreset;
  }

  public getPresetByName(presetName: string): TPresetMetadata {
    if (presetName !== "base") {
      throw new Error(`Unknown preset: ${presetName}`);
    }

    return this.defaultPreset;
  }
}
