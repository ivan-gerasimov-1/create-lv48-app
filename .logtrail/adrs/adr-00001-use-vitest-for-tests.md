# ADR-001: Use Vitest for tests

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-04-14 |

## Context

The project currently runs TypeScript tests through Node's built-in test runner plus a custom loader/register pair. This keeps the dependency surface small, but it also creates project-owned test infrastructure that must be maintained.

Current test usage is small and conventional: describe/it/afterEach, Node assertions, helper assertions, and Node environment behavior. No project tests rely on node:test-specific mocking APIs.

## Decision

Use Vitest as the project test runner.

Replace node:test imports with Vitest imports, migrate assertions to Vitest expect, and remove the custom TypeScript test loader and watch script. Keep tests running in the Node environment and keep explicit non-global test imports.

## Consequences

Positive:

- Less custom test infrastructure to maintain.
- Built-in TypeScript handling for tests.
- Standard watch mode through Vitest.
- Cleaner path for future test features such as snapshots, spies, and coverage if needed.

Negative:

- Adds Vitest as a dev dependency.
- Test runtime behavior moves from Node's native runner to Vitest's runner.
- Future Node upgrades no longer improve test runner behavior directly.

## Alternatives Considered

- Keep node:test and the custom loader: lowest dependency count, but keeps bespoke infrastructure.
- Use Vitest runner while keeping node:assert: smaller diff, but leaves tests less idiomatic for future Vitest work.
- Add a separate transpilation step before node:test: explicit, but slower and more moving parts than needed.

## Reversibility

This decision is reversible by restoring the node:test scripts, loader files, and node:test imports. No production runtime code or public package API changes are required.

## Implemented By

- [CHANGE-001](./changes/change-00001-use-vitest-for-tests.md)

## Related Decisions

- [ADR-002: Colocate test files with tested code](./adr-00002-colocate-test-files-with-tested-code.md) depends on this decision's Vitest test discovery contract.
