# CHANGE-00040: Simplify Either Result Structure

| Status   | Date       | ADRs                                                               |
| -------- | ---------- | ------------------------------------------------------------------ |
| Proposed | 2026-04-28 | [ADR-023](../adrs/adr-00023-use-either-for-typed-result-values.md) |

## Goal

Simplify the project-owned `Either` result structure so a result contains only `data` for success or `error` for failure. Success results must not include `error`, and failure results must not include `data`.

## Scope

Includes the shared `Either` result alias, construction helpers, and affected tests or call sites that unwrap result values. Excludes changing where `Either` is used or introducing a broader functional result API.

## Implementation

1. Replace separate exported `TSuccess<T>` and `TFailure` aliases with one exported `TResult<TData, TError = unknown>` union.
2. Define the success branch with `data: TData` and no `error` field.
3. Define the failure branch with `error: TError` and no `data` field.
4. Update `TResult<TData, TError>` consumers to branch on field presence or another explicit type guard compatible with the new shape.
5. Update `Either.success(...)` and `Either.failure(...)` to construct the new shape.
6. Update unit tests for `Either`, validation, and transform pipeline result handling.

## Verification

Run:

```bash
npm run test
npm run build
```

Expected result:

- Success result values contain only `data`.
- Failure result values contain only `error`, typed as `unknown` by default.
- Existing validation and transform flows still handle success and failure paths correctly.
- Full test suite and build pass.

## Rollback

Restore the previous `ok`/`value`/`reason` result shape in `src/utils/either`, then revert affected consumer and test updates.
