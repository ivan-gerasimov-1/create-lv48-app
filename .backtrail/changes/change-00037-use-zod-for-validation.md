# CHANGE-00037: Use Zod for Validation

| Status   | Date       | ADRs |
| -------- | ---------- | ---- |
| Proposed | 2026-04-26 | [ADR-024](../adrs/adr-00024-use-zod-for-runtime-validation.md) |

## Goal

Replace custom create-lv48-app validation with Zod schema validation so input checks follow ADR-024 and are explicit, composable, and covered by tests.

## Scope

Includes create-lv48-app validation paths selected during implementation and tests for accepted and rejected inputs.

Excludes unrelated Backtrail routing behavior, ADR or FEATURE process changes, and broad validation refactors outside this implementation.

## Implementation

1. Locate the custom validation targeted by this create-lv48-app implementation work.
2. Add or reuse Zod validation with exact dependency pinning if the package is not already present.
3. Preserve current user-facing validation outcomes unless the existing behavior is malformed or inconsistent with Backtrail docs.
4. Add focused tests that cover valid briefs, invalid or missing fields, and validation error formatting.
5. Keep changes limited to targeted create-lv48-app validation, dependency metadata, and tests.

## Verification

Run:

```bash
npm run test
```

Expected result:

- Targeted create-lv48-app validation accepts the same valid input cases.
- Invalid input paths return clear validation failures from Zod.
- Existing test suite passes.

## Rollback

Revert the implementation commit and remove any newly added validation dependency if no other code uses it.
