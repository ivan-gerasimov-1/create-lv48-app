# CHANGE-00045: Avoid type re-exports from implementation files

| Status   | Date       | ADRs | Blocked By | Blocks |
| -------- | ---------- | ---- | ---------- | ------ |
| Proposed | 2026-05-02 | -    | -          | -      |

## Goal

Remove `export type { ... }` re-exports from implementation files and keep shared types exported from dedicated type modules.

## Scope

Include repo scan for implementation files that re-export types, moving those exports into neighboring `types.ts` files or other dedicated type modules, and updating imports as needed.

Exclude behavior changes, API redesign, and unrelated refactors.

## Implementation

1. Scan repo for `export type { ... }` in implementation files.
2. Move each shared type export into a neighboring `types.ts` file or another dedicated type module.
3. Update implementation files to stop re-exporting types.
4. Update imports at call sites if type export paths change.
5. Verify no implementation file still re-exports types.

## Verification

Run:

```bash
npm run test
npm run build
```

Expected result:

- No `export type { ... }` remains in implementation files.
- Type imports still resolve.
- Tests and build pass.

## Rollback

Restore type re-exports in implementation files and revert import path updates.
