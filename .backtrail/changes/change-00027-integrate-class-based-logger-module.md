# CHANGE-00027: Integrate class-based logger module

| Status | Date       | ADRs |
| ------ | ---------- | ---- |
| Done   | 2026-04-25 | -    |

## Goal

Update logger consumers to use the new `src/utils/logger` module and `ILogger` interface after the class-based logger exists.

## Scope

Included:

- Replace imports from `#/utils/logging` with direct imports from `#/utils/logger/logger` and `#/utils/logger/types`.
- Rename `TLogger` references to `ILogger`.
- Instantiate `new Logger()` where the CLI currently calls `createLogger()`.
- Remove the old `src/utils/logging.ts` file after all consumers are migrated.
- Update focused tests only where import paths or type names require it.

Excluded:

- Changing CLI logging behavior, log levels, formatting, or environment variable semantics.
- Adding barrel `index` files for the logger folder.

## Implementation

1. Complete CHANGE-00026 first.
2. Update `src/cli.ts` to import `Logger` and instantiate it when no logger dependency is injected.
3. Update `src/cli/types.ts` to import `ILogger` from `#/utils/logger/types`.
4. Update tests and fixtures that reference logger types or imports.
5. Delete `src/utils/logging.ts` once no imports remain.

## Verification

Run:

```bash
npm run test
```

Expected result:

- Existing CLI tests pass.
- No references to `#/utils/logging` or `TLogger` remain.
- Injected test loggers still satisfy `ILogger`.

## Rollback

Restore `src/utils/logging.ts`, switch imports back to `#/utils/logging`, and rename `ILogger` references back to `TLogger`. Revert CHANGE-00026 if no other consumers rely on `src/utils/logger`.
