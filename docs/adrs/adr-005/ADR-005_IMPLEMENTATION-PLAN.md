# ADR-005 Implementation Plan: Validate package before publish

| Decision                    |
| --------------------------- |
| [ADR-005](./ADR-005.md) |

## Goal

Make publish impossible unless tests, build/typecheck, tsdown `publint`, and dry-run pack pass.

## Implementation

1. Install `publint` as an exact dev dependency.
2. Add `release:prepare`:
   - `npm run test && npm run build -- --publint && npm pack --dry-run`
3. Add `prepublishOnly`:
   - `npm run release:prepare`
4. Keep `release:publish` as:
   - `npm publish`
5. Update `.github/workflows/publish.yml`:
   - remove the separate `Build` step
   - keep `Publish package` as `npm run release:publish`
6. Update README publish flow to name `release:prepare`.
7. Add ADR-005 to `docs/ADL.md`.

## Verification

Run:

```bash
npm run release:prepare
npm run release:publish -- --dry-run
```

If local npm cache ownership breaks `npm pack`, verify pack with:

```bash
npm --cache /tmp/create-lv48-app-npm-cache pack --dry-run --json
```

Expected result:

- Tests pass.
- Build and typecheck pass.
- tsdown `publint` passes.
- Dry-run pack completes before publish.
- `npm run release:publish -- --dry-run` runs `prepublishOnly` without publishing.

## Rollback

Remove `publint`, `release:prepare`, and `prepublishOnly`, then restore a separate GitHub Actions build step before publish if needed.
