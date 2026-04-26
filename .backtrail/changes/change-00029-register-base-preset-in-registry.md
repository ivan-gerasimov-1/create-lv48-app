# CHANGE-00029: Register base preset in registry

| Status | Date       | ADRs |
| ------ | ---------- | ---- |
| Done   | 2026-04-25 | -    |

## Goal

Refactor the preset registry so preset metadata is registered through a private map, with `base` as the default registered preset.

## Scope

Included:

- Move the current `defaultPreset` metadata object into `src/presets/presets.ts` and export it as `base`.
- Remove `getDefaultPreset` from `IPresetRegistry`, `PresetRegistry`, call sites, and focused tests.
- Rename `getPresetByName` to `get`.
- Add `register(preset: TPresetMetadata)` to the registry contract and implementation.
- Add a private `presets` `Map` to `PresetRegistry`.
- Register `base` in the `PresetRegistry` constructor.
- Update `get` so it accepts an optional preset name with `base` as default, and throws when the preset is not registered.
- Update CLI usage and tests for the new registry API.

Excluded:

- Changing `TPresetMetadata` shape.
- Changing template metadata generated from `templates/base/template.ts`.
- Adding preset discovery, dynamic imports, or persistence.
- Adding barrel-style `index` modules.

## Implementation

1. Create `src/presets/presets.ts` with exported `base` preset metadata derived from `baseTemplate`.
2. Update `IPresetRegistry` to expose `get(presetName?: string)` and `register(preset: TPresetMetadata)`.
3. Replace the private `defaultPreset` field in `PresetRegistry` with a private `presets` map.
4. Add a constructor that registers the imported `base` preset.
5. Implement `register` by storing presets by `preset.name`.
6. Implement `get` with `presetName` defaulting to `base`, returns the matching preset, and throws `Unknown preset: ${presetName}` when no preset exists.
7. Update CLI and test callers from `getDefaultPreset` and `getPresetByName` to `get`.
8. Add focused tests for default `get()`, named `get("base")`, unknown names, and registering a custom preset.

## Verification

Run:

```bash
npm run test
```

Expected result:

- CLI still selects the base preset when no preset name is provided.
- `PresetRegistry.get()` returns the registered base preset.
- `PresetRegistry.get("base")` returns the registered base preset.
- `PresetRegistry.get("unknown")` throws an unknown preset error.
- Registered custom presets can be retrieved by name.

## Rollback

Restore `defaultPreset`, `getDefaultPreset`, and `getPresetByName` in `PresetRegistry` and `IPresetRegistry`; remove `src/presets/presets.ts`; switch CLI and tests back to the previous methods.
