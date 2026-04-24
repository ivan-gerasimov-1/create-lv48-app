import type { TTemplateMetadata } from "./templateDefinition";

export type TPresetMetadata = TTemplateMetadata;

export type TPresetRegistry = {
  defaultPresetName: "base";
  getDefaultPreset(): TPresetMetadata;
  getPresetByName(presetName: string): TPresetMetadata;
};
