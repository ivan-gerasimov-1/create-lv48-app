import type { TPresetMetadata } from "#/presets/types";

export interface IPresetRegistry {
  get(presetName?: string): TPresetMetadata;
  register(preset: TPresetMetadata): void;
}
