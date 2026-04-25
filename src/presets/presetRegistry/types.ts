import type { TPresetMetadata } from "../types";

export interface IPresetRegistry {
  getDefaultPreset(): TPresetMetadata;
  getPresetByName(presetName: string): TPresetMetadata;
}
