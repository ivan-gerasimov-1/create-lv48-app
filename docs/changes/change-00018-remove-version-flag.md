# CHANGE-018: Remove version flag

| Status | Date       | ADRs |
| ------ | ---------- | ---- |
| Done   | 2026-04-25 | -    |

## Goal

Remove the `--version` flag handling from the `runCli` function.

## Scope

Remove the version check and early return logic from `src/cli.ts`. This is a simple removal with no other changes required.

## Implementation

1. Delete lines 21-28 from `src/cli.ts` (the `--version` check block that reads package.json and prints the version)

## Verification

Run:

```bash
npm run test
```

Expected result:

- All tests pass
- CLI scaffolds projects correctly without the version flag option

## Rollback

Restore the deleted version check block (lines 21-28) to `src/cli.ts` if version flag functionality needs to be reinstated.
