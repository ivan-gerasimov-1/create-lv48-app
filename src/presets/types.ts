import type { TPackageManager } from '../prompts/types.js';

export type TPresetMetadata = {
  id: 'base';
  displayName: string;
  description: string;
  packageManagers: TPackageManager[];
  templateDirectory: string;
  reservedDirectories?: string[];
  placeholderKeys: string[];
  postGeneration: {
    installDependencies: boolean;
    initializeGit: boolean;
  };
};

export type TPresetRegistry = {
  defaultPresetId: 'base';
  getDefaultPreset(): TPresetMetadata;
  getPresetById(presetId: string): TPresetMetadata;
};
