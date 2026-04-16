# ADR-013 Implementation Plan: Restrict default parameters to simple literals

| Decision                | Status   |
| ----------------------- | -------- |
| [ADR-013](./ADR-013.md) | Accepted |

## Goal

Make dependency-bearing factory signatures explicit while keeping harmless literal defaults available for simple values.

## Implementation

1. Update prompt composition:
   - Change `createPromptController(promptIo: TPromptIO = createClackPromptIo())` to require `promptIo: TPromptIO`.
   - Move production prompt IO construction into `runCli()` with `dependencies.promptController ?? createPromptController(createClackPromptIo())`.
2. Update post-setup composition:
   - Change `createPostSetupExecutor(commandExecutor: TCommandExecutor = executeCommand)` to require `commandExecutor: TCommandExecutor`.
   - Export or otherwise expose the production command executor so `runCli()` can call `createPostSetupExecutor(dependencies.commandExecutor ?? executeCommand)`.
3. Keep allowed simple defaults:
   - Keep `runCli(dependencies = {})`.
   - Keep `collectAnswers(defaultProjectName = "lv48-app")`.
4. Add a static guard test for `src/**/*.ts` using the TypeScript AST.
   - Accept simple literals, object literals, and array literals whose nested values are simple literals.
   - Reject calls, constructors, identifiers, functions, and other non-literal parameter defaults.
5. Update existing tests and call sites affected by the explicit factory signatures.

## Verification

Run:

```bash
npm run test
npm run build:typecheck
npm run build
```

Expected result:

- Tests pass.
- Typecheck passes.
- Build succeeds.
- `createPromptController()` cannot be called without a `TPromptIO`.
- `createPostSetupExecutor()` cannot be called without a `TCommandExecutor`.
- The static guard accepts `dependencies = {}` and `defaultProjectName = "lv48-app"`.
- The static guard would reject `promptIo = createClackPromptIo()` and `commandExecutor = executeCommand`.

## Rollback

Remove the static guard test, restore the previous optional factory signatures, and move production dependency defaults back into the factory parameter lists.
