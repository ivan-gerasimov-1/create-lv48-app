# CHANGE-012: Use Clack for interactive CLI prompts

| Status | Date       | ADRs                                                                  |
| ------ | ---------- | --------------------------------------------------------------------- |
| Done   | 2026-04-16 | [ADR-012](./adrs/adr-00012-use-clack-for-interactive-cli-prompts.md) |

## Goal

Replace the readline-backed interactive prompt implementation with Clack while preserving the CLI answer contract used by generation.

## Scope

Implement [ADR-012](./adrs/adr-00012-use-clack-for-interactive-cli-prompts.md).

## Implementation

1. Install exact runtime dependency:
   ```bash
   npm install --save-exact @clack/prompts@1.2.0
   ```
2. Replace the readline-backed prompt implementation with a Clack-backed implementation.
3. Keep `createPromptController()` as the public prompt module entrypoint for the CLI.
4. Use Clack `text` for project name, target directory, and first app project name.
5. Use Clack `select` for workspace layout with `single` as the first and default option and `multi` as the second option.
6. Use Clack `confirm` for install dependencies and initialize git prompts.
7. Keep validation behavior:
   - invalid text answers re-prompt
   - validation messages surface to the user
   - normalized valid values become returned answers
8. Add controlled cancel behavior:
   - detect Clack cancel values with `isCancel`
   - print a cancellation message with `cancel`
   - throw or exit through one consistent CLI error path
9. Remove `readlinePromptIo` only if no remaining imports use it.
10. Keep `runCli()` `--version` behavior unchanged.
11. Do not add Commander, flags, positional arguments, subcommands, or non-interactive mode in this change.

## Verification

Run:

```bash
npm run test
npm run build:typecheck
npm run build
npm run start -- --version
```

Expected result:

- Tests pass.
- Typecheck passes.
- Build succeeds.
- Start command prints the package version when passed `--version`.
- Interactive prompt behavior returns the same `TPromptAnswers` shape as before.

Add or update tests for:

- single-project default flow
- multi-project flow
- invalid project name retry
- invalid target directory retry
- cancel path
- `--version` still prints package version without prompts

## Rollback

Restore the readline-backed prompt implementation, remove `@clack/prompts` from runtime dependencies, and keep `TPromptController.collectAnswers(defaultProjectName?)` stable for CLI callers.
