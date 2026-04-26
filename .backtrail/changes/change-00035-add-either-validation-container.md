# CHANGE-00035: Add Either Container

| Status   | Date       | ADRs |
| -------- | ---------- | ---- |
| Done     | 2026-04-26 | [ADR-023](../adrs/adr-00023-use-either-for-typed-result-values.md) |

## Goal

Add a basic `Either` container based on the current validation success, failure, and result types.

## Scope

Includes a minimal project-owned `Either` container API and focused unit coverage for success and failure construction. Excludes converting validation helpers or other call sites.

## Implementation

1. Add the `Either` container with static construction methods matching the current `TValidationSuccess`, `TValidationFailure`, and `TValidationResult` shape.
2. Name the static construction methods around `success` and `failure` instead of `right` and `left` so validation call sites read in domain terms.
3. Base validation result type aliases on the new `Either` types without changing current validation helper implementation.
4. Add unit tests for `Either` success and failure construction.

## Verification

Run:

```bash
npm run test
```

Expected result:

- Validation behavior and `Either` construction pass.

## Rollback

Remove the `Either` container, restore validation result type aliases to local object shapes, and revert related tests.
