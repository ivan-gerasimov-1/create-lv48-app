# ADR-010 Implementation Plan: Rename template identifier to name

| Decision                    | Status   |
| --------------------------- | -------- |
| [ADR-010](./ADR-010.md) | Accepted |

## Goal

Replace template and preset `id` terminology with `name` while keeping the existing `base` template folder and generated asset layout unchanged.

## Implementation

1. Update template metadata types so `TTemplateMetadata` exposes `name: "base"` instead of `id: "base"`.
2. Update `defineTemplate(config)` to derive `filesRoot` from `config.name`.
3. Update the base template definition to provide `name: "base"`.
4. Update preset registry metadata and API names from `defaultPresetId` and `getPresetById` to `defaultPresetName` and `getPresetByName`.
5. Update CLI output to read `preset.name`.
6. Update current source-of-truth docs from `id` terminology to `name` terminology where they describe template metadata and registry behavior.
7. Add or update tests for `defineTemplate()` and preset registry behavior.

## Verification

Run:

```bash
npm run test
npm run build:typecheck
npm run build
```

Expected result:

- Tests pass.
- Typecheck catches no stale `id` references.
- Build succeeds with template definitions included.
- `defineTemplate()` returns metadata with `name` and computes `templates/base/files`.
- Preset registry returns the `base` preset through name-based APIs.

## Rollback

Restore `id` metadata, restore `defaultPresetId` and `getPresetById`, restore `config.id` path derivation, and revert docs and tests that expect `name`.
