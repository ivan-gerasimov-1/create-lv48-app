# CHANGE-00039: Return Either from transform pipeline

| Status | Date       | ADRs                                                               |
| ------ | ---------- | ------------------------------------------------------------------ |
| Done   | 2026-04-27 | [ADR-023](../adrs/adr-00023-use-either-for-typed-result-values.md) |

## Goal

Replace expected transform exceptions with `Either` result values so transform failures are explicit at the pipeline boundary.

## Scope

Included:

- Update transform pipeline methods that can fail to return `TResult<T>` or equivalent `Either` aliases.
- Convert package.json parse and shape failures from thrown `Error` values into `Either.failure(...)`.
- Convert unresolved placeholder failures into `Either.failure(...)` when they are part of the transform pipeline flow.
- Update `GenerationRunner` to unwrap transform results and preserve rollback behavior on failure.
- Preserve existing user-facing error messages where practical.
- Add or update tests for transform success and failure results.

Excluded:

- Replacing high-level filesystem, template directory, or target directory safety exceptions outside the transform layer.
- Changing the `Either` API from ADR-023 unless a separate ADR or change record supersedes it.
- Changing prompt validation behavior already covered by validation changes.

## Implementation

1. Update transform result types in `src/transforms/types.ts` to use the project-owned `Either` result type from `src/utils/either/types.ts`.
2. Convert `transformPackageJson(...)` JSON parse failures and invalid JSON object failures to `Either.failure(...)`.
3. Convert placeholder interpolation failures used by transform pipeline calls to `Either.failure(...)`.
4. Update `TransformPipeline` from CHANGE-00038 so public methods return typed success or failure results where failure is possible.
5. Update `GenerationRunner` to check transform results, throw a single `Error` with the failure reason for rollback compatibility, and avoid writing failed transform output.
6. Add focused tests for valid package transforms, invalid package.json parse errors, invalid package.json shapes, and unresolved placeholders.

## Verification

Run:

```bash
npm run test
npm run build
```

Expected result:

- Transform failures return typed failure values before generation unwraps them.
- Generation rollback still removes files and directories created before a transform failure.
- Existing CLI behavior and error text remain compatible.
- Full test suite passes.

## Rollback

Restore transform methods to return plain strings and throw `Error` values for parse, shape, and placeholder failures. Revert `GenerationRunner` unwrapping logic and related tests.
