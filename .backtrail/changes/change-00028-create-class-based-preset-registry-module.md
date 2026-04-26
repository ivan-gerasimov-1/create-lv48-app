# CHANGE-00028: Create class-based preset registry module

| Status | Date       | ADRs |
| ------ | ---------- | ---- |
| Done   | 2026-04-25 | -    |

## Goal

Replace the current object-literal preset registry factory internals with a class-based registry module while preserving existing runtime behavior.

## Scope

Included:

- Move preset registry implementation from `src/presets/presetRegistry.ts` into a `src/presets/presetRegistry` sub-folder.
- Introduce a `PresetRegistry` class with `public getDefaultPreset` and `public getPresetByName` members.
- Rename the registry contract from `TPresetRegistry` to `IPresetRegistry`.
- Move `IPresetRegistry` into neighboring `src/presets/presetRegistry/types.ts`.
- Remove `createPresetRegistry` factory function and migrate call sites to `new PresetRegistry()`.
- Remove `defaultPresetName` property from `IPresetRegistry` interface and `PresetRegistry` class.
- Make `defaultPreset` field `private readonly`.
- Update registry imports, exports, and focused tests for the new module path and interface name.

Excluded:

- Changing preset metadata shape or `TPresetMetadata`.
- Changing default preset selection, supported preset names, or unknown-preset error behavior.
- Adding barrel `index` files for the preset registry folder.

## Implementation

1. Create `src/presets/presetRegistry/types.ts` with exported `IPresetRegistry` interface that references `TPresetMetadata`.
2. Create `src/presets/presetRegistry/presetRegistry.ts` with exported `PresetRegistry` class implementing `IPresetRegistry`.
3. Remove `createPresetRegistry` factory function and migrate call sites to `new PresetRegistry()`.
4. Remove `defaultPresetName` property from `IPresetRegistry` interface and `PresetRegistry` class.
5. Make `defaultPreset` field `private readonly`.
6. Move focused registry tests next to the new implementation path and keep assertions behavior-based.
7. Update imports that reference `#/presets/presetRegistry` or `TPresetRegistry` so no stale path or type name remains.
8. Delete the old flat `src/presets/presetRegistry.ts` after all consumers are migrated.

## Verification

Run:

```bash
npm run test
```

Expected result:

- Existing preset registry behavior remains compatible.
- No references to `TPresetRegistry` remain.
- TypeScript accepts `PresetRegistry implements IPresetRegistry` without assertions or `any`.

## Rollback

Restore `src/presets/presetRegistry.ts`, switch imports back to `#/presets/presetRegistry`, and rename `IPresetRegistry` references back to `TPresetRegistry`. Delete `src/presets/presetRegistry` if no consumers rely on the isolated module.
