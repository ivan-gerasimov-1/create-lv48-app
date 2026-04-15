# ADR-002 Implementation Plan: Colocate test files with tested code

| Decision                    |
| --------------------------- |
| [ADR-002](./ADR-002.md) |

## Goal

Move runnable test files next to the production modules they validate while keeping shared test helpers and fixtures under `tests/`.

## Implementation

1. Move `tests/cli.test.ts` to `src/cli.test.ts`.
2. Split and move `tests/postSetup.test.ts`:
   - post-setup executor cases -> `src/cli/postSetup.test.ts`
   - initialization summary case -> `src/cli/summary.test.ts`
3. Split and move `tests/prompts.test.ts`:
   - prompt controller case -> `src/prompts/index.test.ts`
   - validation cases -> `src/utils/validation.test.ts`
4. Keep shared test support in place:
   - `tests/helpers.ts`
   - `tests/fixtures/**`
5. Update imports in moved tests:
   - production imports become relative to the new colocated location.
   - shared helpers continue to import from `tests/helpers.js` using the correct relative path.
6. Update `vitest.config.ts`:
   - include `src/**/*.test.ts`
   - stop including `tests/**/*.test.ts`
7. Update TypeScript config:
   - keep `tests/**/*.ts` and `tests/**/*.d.ts` in `tsconfig.json` for shared helpers.
   - exclude `src/**/*.test.ts`, `tests/**/*.ts`, and `tests/**/*.d.ts` from `tsconfig.build.json`.
8. Remove only old runnable test files from `tests/`.

## Verification

Run:

```bash
npm run test
npm run build
rg "tests/.*\\.test\\.ts|tests/\\*\\*/\\*.test\\.ts" .
find tests -name "*.test.ts" -print
```

Expected result:

- All tests pass.
- Build passes.
- No runnable test files remain under `tests/`.
- `tests/helpers.ts` and `tests/fixtures/**` remain available.
- Vitest discovers tests from `src/**/*.test.ts`.

## Rollback

Move `*.test.ts` files back under `tests/`, restore test imports, restore Vitest include to `tests/**/*.test.ts`, and remove the colocated test exclusions from build config.
