# CHANGE-00036: Use Either In Validation

| Status   | Date       | ADRs |
| -------- | ---------- | ---- |
| Done | 2026-04-26 | [ADR-023](../adrs/adr-00023-use-either-for-typed-result-values.md) |

## Goal

Use the `Either` container in validation helpers instead of returning custom result object literals.

## Scope

Includes updating `validation.ts` to construct results through `Either` and preserving existing validation behavior. Excludes adding new validation rules or adopting `Either` outside validation.

## Implementation

1. Import the `Either` container into `validation.ts`.
2. Replace custom success and failure object literals with `Either` static construction methods.
3. Keep `validateProjectName`, `validatePackageName`, and `validateTargetDirectory` return behavior structurally compatible with current tests and consumers.

## Verification

Run:

```bash
npm run test
```

Expected result:

- Existing validation behavior passes with results constructed through `Either`.

## Rollback

Restore direct validation result object literals in `validation.ts`.
