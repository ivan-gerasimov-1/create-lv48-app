# CHANGE-001: Use Vitest for tests

| Status | Date       | ADRs |
| ------ | ---------- | ---- |
| Done   | 2026-04-14 | [ADR-001](../adrs/ADR-001.md) |

## Goal

Replace the current node:test-based TypeScript test setup with Vitest while preserving existing test behavior.

## Scope

Implement [ADR-001](../adrs/ADR-001.md).

## Implementation

1. Install Vitest as an exact dev dependency.
2. Replace package scripts:
   - test -> vitest run
   - test:watch -> vitest
3. Add vitest.config.ts with:
   - Node test environment
   - explicit imports, no globals
   - include patterns for tests/**/*.test.ts and .github/scripts/**/*.test.ts
4. Convert tests from node:test imports to Vitest imports.
5. Convert assertions from node:assert/strict to expect.
6. Update tests/helpers.ts to use Vitest assertions.
7. Delete obsolete custom test infrastructure:
   - scripts/tsTestRegister.js
   - scripts/tsTestLoader.js
   - scripts/watchTests.js
8. Update README test wording from node:test to Vitest.

## Verification

Run:

```bash
npm run test
npm run build
npx vitest --help
rg "node:test|node --test|tsTestRegister|tsTestLoader|watchTests|Tests use built-in"
```

Expected result:

- All tests pass.
- Build passes.
- Vitest CLI is available.
- Old node:test infrastructure references are gone.

## Rollback

Restore the previous package scripts, loader/watch files, node:test imports, and package lock state.
