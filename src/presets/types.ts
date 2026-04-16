import type { TTemplateMetadata } from "./templateDefinition.js";

export type TPresetMetadata = TTemplateMetadata;

export type TPresetRegistry = {
  defaultPresetId: "base";
  getDefaultPreset(): TPresetMetadata;
  getPresetById(presetId: string): TPresetMetadata;
};
