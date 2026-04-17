# CHANGE-015: Use class-based post-setup orchestration

| Status | Date       | ADRs                          |
| ------ | ---------- | ----------------------------- |
| Done   | 2026-04-16 | [ADR-015](../adrs/ADR-015.md) |

## Goal

Refactor post-setup orchestration so `PostSetupExecutor` owns action ordering and each post-setup action owns its command behavior and status details.

## Scope

Include only `src/cli/postSetup.ts`, neighboring type changes needed to preserve the existing public contracts, and behavior-focused post-setup tests.

Do not change generated output, prompt behavior, summary behavior, command behavior, action order, failure semantics, or class usage outside post-setup orchestration.

## Implementation

1. Add a local post-setup action contract for action name, command detail, progress payload creation, skipped/completed/failed status creation, and execution.
2. Add `PostSetupExecutor` so it receives the command executor, builds the ordered action list, emits progress for selected actions, and returns the same `TPostSetupActionStatus[]` shape.
3. Add an install-dependencies action class that keeps `npm install` behavior and status details unchanged.
4. Add a git-initialization action class that keeps `git init --initial-branch=main`, fallback `git init`, and `git symbolic-ref HEAD refs/heads/main` behavior unchanged.
5. Keep `createPostSetupExecutor(commandExecutor)` as the compatibility factory returning the class-backed executor.
6. Keep `executeCommand(...)` as the command execution adapter and avoid moving process spawning into the action classes.
7. Keep tests focused on observable behavior: action order, skipped statuses, progress messages, git fallback, and non-blocking post-setup failures.

## Verification

Run:

```bash
npm run lint
npm run test
```

Expected result:

- Existing post-setup behavior remains unchanged.
- CLI public composition through `createPostSetupExecutor(commandExecutor)` remains unchanged.
- No tests assert class internals.

## Rollback

Restore the function-based `runOptionalAction(...)` and `initializeGitRepository(...)` implementation while keeping `createPostSetupExecutor(commandExecutor)`, `TPostSetupExecutor.run(...)`, result shape, and post-setup tests intact.
