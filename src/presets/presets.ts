import { baseTemplate } from "#/templates/base/template";
import type { TPresetMetadata } from "./types";

export const base: TPresetMetadata = {
  name: baseTemplate.name,
  displayName: baseTemplate.displayName,
  description: baseTemplate.description,
  packageManagers: baseTemplate.packageManagers,
  reservedDirectories: baseTemplate.reservedDirectories,
  placeholderKeys: baseTemplate.placeholderKeys,
  postGeneration: baseTemplate.postGeneration,
};
