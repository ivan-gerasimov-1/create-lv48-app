import type { TTemplateMetadata } from "./templateDefinition.js";

export type TPresetMetadata = TTemplateMetadata;

export type TPresetRegistry = {
  defaultPresetName: "base";
  getDefaultPreset(): TPresetMetadata;
  getPresetByName(presetName: string): TPresetMetadata;
};
