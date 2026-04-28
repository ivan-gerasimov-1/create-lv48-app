# CHANGE-00041: Rename Template and Preset Types

| Status   | Date       | ADRs | Blocked By | Blocks |
| -------- | ---------- | ---- | ---------- | ------ |
| Proposed | 2026-04-28 | -    | -          | -      |

## Goal

Rename the template and preset metadata type aliases from `TTemplateMetadata` and `TPresetMetadata` to `TTemplate` and `TPreset` while preserving the existing metadata shape and runtime behavior.

## Scope

Includes the type declarations, exported type names, imports, annotations, and focused tests or call sites that reference the old names. Excludes changing template metadata fields, preset registry behavior, template loading, generated output, or adding backward-compatible alias exports unless implementation requires a staged migration.

## Implementation

1. Rename `TTemplateMetadata` to `TTemplate` in the template definition module.
2. Rename `TPresetMetadata` to `TPreset` in the preset types module.
3. Update `TTemplateDefinition`, `defineTemplate(...)`, preset registry contracts, preset declarations, generation types, transform tests, and any remaining imports to use the new names.
4. Search the repository for stale `TTemplateMetadata` and `TPresetMetadata` references after edits.
5. Avoid changing metadata fields or runtime registry behavior.

## Verification

Run:

```bash
npm run test
npm run build
```

Expected result:

- No references to `TTemplateMetadata` or `TPresetMetadata` remain.
- Existing preset registry, generation, and transform behavior still passes tests.
- Build passes with the renamed exported type names.

## Rollback

Restore the previous type names in `src/presets/templateDefinition.ts` and `src/presets/types.ts`, then revert affected imports and annotations.
