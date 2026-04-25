# ADR-002: Colocate test files with tested code

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-04-14 |

## Context

The project currently keeps all test files under `tests/`. This separates tests from the modules they validate, so related behavior is harder to discover during feature work.

The current Vitest setup points directly at `tests/**/*.test.ts`, which encodes the old layout. Moving test files into `src/**` requires explicit config changes so Vitest discovers colocated tests and the production build does not emit test files.

Some shared test-only support still exists: `tests/helpers.ts` and `tests/fixtures/**`. These are not production modules and are not themselves tests.

## Decision

Colocate `*.test.ts` files with the closest production module they validate.

Keep `tests/helpers.ts` and `tests/fixtures/**` under `tests/` for now as shared test support. Do not place runnable test files under `tests/`.

Update Vitest discovery to use colocated test files under `src/**/*.test.ts`. Update TypeScript build config so colocated tests are type-checkable in development but excluded from production build output.

## Consequences

Positive:

- Test ownership becomes easier to see while editing production modules.
- Module behavior and test coverage stay close together.
- `tests/` no longer acts as a parallel source tree for runnable tests.

Negative:

- `src/` now contains test files, so build exclusion rules must stay correct.
- Cross-module or CLI-flow tests need a nearest-owner placement decision.
- `tests/` still exists for helpers and fixtures, so the project does not fully eliminate test support outside `src`.

## Alternatives Considered

- Move all test support out of `tests/`: cleaner directory rule, but larger change and not required for colocating runnable tests.
- Keep all tests under `tests/`: smallest change, but preserves the discoverability problem.
- Add `src/testSupport/`: keeps all test-only code under `src`, but risks confusing support code with production module structure.

## Reversibility

This decision is reversible by moving `*.test.ts` files back under `tests/`, restoring Vitest's include pattern to `tests/**/*.test.ts`, and removing the build exclusion for colocated test files. Production runtime code and public package API are not affected.

## Implemented By

- [CHANGE-002](./changes/change-00002-colocate-test-files-with-tested-code.md)

## Related Decisions

- [ADR-001: Use Vitest for tests](./adr-00001-use-vitest-for-tests.md) establishes the Vitest runner and discovery behavior this decision updates.
