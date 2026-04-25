# CHANGE-00026: Create class-based logger module

| Status | Date       | ADRs |
| ------ | ---------- | ---- |
| Done   | 2026-04-25 | -    |

## Goal

Replace the current object-literal logger factory internals with a class-based logger module while preserving existing runtime behavior.

## Scope

Included:

- Move logger implementation from `src/utils/logging.ts` into a `src/utils/logger` sub-folder.
- Rename the module from `logging` to `logger`.
- Introduce a `Logger` class with public `info`, `debug`, and `error` methods.
- Move the logger contract into neighboring `src/utils/logger/types.ts` as `ILogger`.

Excluded:

- Updating call sites outside the new module. That happens in CHANGE-00027.
- Changing message formatting, output streams, or `DEBUG=1` behavior.

## Implementation

1. Create `src/utils/logger/types.ts` with exported `ILogger` interface.
2. Create `src/utils/logger/logger.ts` with exported `Logger` class implementing `ILogger`.
3. Keep method behavior equivalent to current `createLogger`: `info` writes to `console.log`, `debug` writes to `console.log` only when `process.env["DEBUG"] === "1"`, and `error` writes to `console.error`.
4. Remove `src/utils/logging.ts` only after consumers are migrated in CHANGE-00027.

## Verification

Run:

```bash
npm run test
```

Expected result:

- Logger behavior remains compatible with existing CLI tests.
- TypeScript accepts `Logger implements ILogger` without assertions or `any`.

## Rollback

Delete `src/utils/logger` and keep `src/utils/logging.ts` as the only logger implementation. If CHANGE-00027 has already landed, revert it first or restore import compatibility in `src/utils/logging.ts`.
