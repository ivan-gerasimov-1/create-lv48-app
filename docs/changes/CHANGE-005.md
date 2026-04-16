# CHANGE-005: Validate package before publish

| Status | Date       | ADRs |
| ------ | ---------- | ---- |
| Done   | 2026-04-15 | [ADR-005](../adrs/ADR-005.md) |

## Goal

Make publish impossible unless tests, build/typecheck, and tsdown `publint` pass.

## Scope

Implement [ADR-005](../adrs/ADR-005.md).

## Implementation

1. Install `publint` as an exact dev dependency.
2. Add `release:prepare`:
   - `npm run test && npm run build -- --publint`
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

Expected result:

- Tests pass.
- Build and typecheck pass.
- tsdown `publint` passes.
- `npm run release:publish -- --dry-run` runs `prepublishOnly` without publishing.

## Rollback

Remove `publint`, `release:prepare`, and `prepublishOnly`, then restore a separate GitHub Actions build step before publish if needed.
