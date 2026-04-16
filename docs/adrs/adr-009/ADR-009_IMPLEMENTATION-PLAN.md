# ADR-009 Implementation Plan: Use typed portable template definitions

| Decision                | Status   |
| ----------------------- | -------- |
| [ADR-009](./ADR-009.md) | Accepted |

## Goal

Replace JSON-backed template metadata with typed template definitions and make copied assets live under a fixed sibling `files` directory.

## Implementation

1. Add a `defineTemplate(config)` helper that accepts `rootDir: import.meta.url` and typed metadata.
2. Make the helper compute internal `filesRoot` from the directory that contains `rootDir`.
3. Move base generated assets into `templates/base/files`.
4. Add `templates/base/template.ts` with `rootDir: import.meta.url` and the current base metadata.
5. Remove `templates/base/_meta/template.json` and the JSON metadata loader.
6. Remove `templateBaseDirectory`, `templateDirectory`, and `templateRoot` from public metadata and generation context.
7. Update the generator to copy files from internal `filesRoot`.
8. Update project documentation from the `template.json` model to the `template.ts` plus `files` model.

## Verification

Run:

```bash
npm run test
npm run build:typecheck
npm run build
```

Expected result:

- Tests pass.
- Typecheck includes typed template definitions.
- Build succeeds with template definitions available to the CLI.
- Generated output contains assets from `files` only, not `template.ts`.

Add or update tests for:

- `defineTemplate()` computes sibling `filesRoot` and preserves metadata.
- Preset registry returns the `base` template without public path fields in metadata.
- Generation copies from `filesRoot`.
- `template.ts` does not appear in generated projects.

## Rollback

Restore `_meta/template.json`, restore the JSON loader, restore the old metadata path fields, and move template assets back to the previous template root layout.
