import { base } from "#/presets/presets";
import type { TPresetMetadata } from "#/presets/types";

import type { IPresetRegistry } from "./types";

export class PresetRegistry implements IPresetRegistry {
  private readonly presets = new Map<string, TPresetMetadata>();

  constructor() {
    this.register(base);
  }

  public register(preset: TPresetMetadata): void {
    this.presets.set(preset.name, preset);
  }

  public get(presetName: string = "base"): TPresetMetadata {
    let preset = this.presets.get(presetName);

    if (!preset) {
      throw new Error(`Unknown preset: ${presetName}`);
    }

    return preset;
  }
}
