export type PresetRegistry = {
  defaultPresetId: 'base';
};

export function createPresetRegistry(): PresetRegistry {
  return {
    defaultPresetId: 'base',
  };
}
