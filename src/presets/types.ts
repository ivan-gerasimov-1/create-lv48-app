import type { PackageManager } from '../prompts/types.js';

export type PresetMetadata = {
  id: 'base';
  displayName: string;
  description: string;
  packageManagers: PackageManager[];
  templateDirectory: string;
  placeholderKeys: string[];
  postGeneration: {
    installDependencies: boolean;
    initializeGit: boolean;
  };
};

export type PresetRegistry = {
  defaultPresetId: 'base';
  getDefaultPreset(): PresetMetadata;
  getPresetById(presetId: string): PresetMetadata;
};
