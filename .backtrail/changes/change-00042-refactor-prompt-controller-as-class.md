# CHANGE-00042: Refactor prompt controller as class

| Status | Date       | ADRs | Blocked By | Blocks |
| ------ | ---------- | ---- | ---------- | ------ |
| Done   | 2026-04-29 | -    | -          | -      |

## Goal

Refactor prompt answer collection from a factory-created object into an explicit `PromptController` class while preserving current interactive prompt behavior and CLI defaults.

## Scope

Included:

- Rename `TPromptController` to `IPromptController` and convert it to an interface.
- Replace `createPromptController(...)` with direct `PromptController` construction.
- Store `TPromptIO` on `PromptController` as a private property.
- Move `collectAnswers(...)` into a public class method with explicit visibility.
- Move prompt helper behavior into private class methods where it depends on prompt IO.
- Keep pure display-name formatting as a standalone helper unless class state becomes necessary.
- Update CLI construction, prompt controller tests, and imports affected by the class conversion.

Excluded:

- Changes to prompt text, defaults, validation rules, package manager selection, preset selection, workspace layout behavior, or Clack IO behavior.
- New prompt controller responsibilities beyond preserving current answer collection flow.
- Changes to unrelated CLI argument parsing work.

## Implementation

1. Convert `TPromptController` in `src/prompts/types.ts` from a type alias to `IPromptController` as an interface.
2. Add a `PromptController` class in `src/prompts/promptController.ts` that accepts `TPromptIO` in the constructor and stores it as `private readonly promptIo`.
3. Move `collectAnswers(...)` into `PromptController` as a `public` method and preserve the existing `try`/`finally` close behavior.
4. Move `askWorkspaceLayout(...)` and `askValidText(...)` into private methods on `PromptController`, using the stored prompt IO instead of passing it through each call.
5. Update `src/cli.ts`, `src/cli/types.ts`, and prompt controller tests to import and instantiate `PromptController` directly.
6. Update exported types from `src/prompts/promptController.ts` and any affected imports.

## Verification

Run:

```bash
npm run test
npm run build
```

Expected result:

- Existing prompt controller tests pass.
- CLI prompt flow still collects the same answers and closes prompt IO after success or validation failures.
- TypeScript compiles with explicit class visibility modifiers and no stale `createPromptController(...)` references.

## Rollback

Restore `TPromptController`, `createPromptController(...)`, helper functions that accept `TPromptIO`, and previous CLI/test imports. Revert `IPromptController` and direct `PromptController` construction if no downstream code has adopted them.
