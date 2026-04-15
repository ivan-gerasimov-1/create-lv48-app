# ADR-006 Implementation Plan: Avoid project-owned index files

| Decision                    |
| --------------------------- |
| [ADR-006](./ADR-006.md) |

## Goal

Replace project-owned `index` filenames with functional names while preserving framework-required `index` entrypoints.

## Implementation

1. Rename owned source modules:
   - `src/prompts/index.ts` -> `src/prompts/promptController.ts`
   - `src/generate/index.ts` -> `src/generate/generationRunner.ts`
   - `src/transforms/index.ts` -> `src/transforms/transformPipeline.ts`
   - `src/presets/index.ts` -> `src/presets/presetRegistry.ts`
2. Move shared transform type:
   - create `src/transforms/types.ts`
   - move `TTransformPipeline` there
3. Rename tests:
   - `src/prompts/index.test.ts` -> `src/prompts/promptController.test.ts`
   - `src/transforms/index.test.ts` -> `src/transforms/transformPipeline.test.ts`
4. Update imports from `/index.js` to functional module paths.
5. Rename template-owned files:
   - `templates/base/apps/api/src/index.ts` -> `templates/base/apps/api/src/app.ts`
   - `templates/base/apps/web/src/index.css` -> `templates/base/apps/web/src/global.css`
6. Update template references:
   - API package scripts point to `src/app.ts`
   - Web `main.tsx` imports `./global.css`
   - `components.json`, README, and App copy reference `src/global.css`
7. Update docs:
   - `docs/SRD.md`
   - `docs/engineering-conventions.md`
   - `AGENTS.md`
8. Do not rename:
   - `templates/base/apps/web/index.html`
   - `templates/base/apps/site/src/pages/index.astro`
9. Add ADR-006 to `docs/ADL.md`.

## Verification

Run:

```bash
npm run test
npm run build:typecheck
rg "index\\.ts|index\\.css|/index\\.js|src/index" src templates docs AGENTS.md
```

Expected result:

- Tests pass.
- Typecheck passes.
- Remaining `index` references are framework-required entrypoints or ADR context.

## Rollback

Restore previous filenames, imports, template references, docs, and remove ADR-006 from `docs/ADL.md`.
