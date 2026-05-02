# CHANGE-032: Use Commander for CLI argument parsing

| Status   | Date       | ADRs                                                        | Blocked By | Blocks                                                                            |
| -------- | ---------- | ----------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------- |
| Proposed | 2026-04-26 | [ADR-022](./adrs/adr-00022-use-commander-for-cli-argument-parsing.md) | -          | [CHANGE-043](./changes/change-00043-refactor-application-entrypoint.md) |

## Goal

Implement [ADR-022](./adrs/adr-00022-use-commander-for-cli-argument-parsing.md) by adding Commander as the CLI argument parsing boundary for `create-lv48-app`.

## Scope

Include Commander installation, parser construction, `--version` handling through the parser layer, parser-focused tests, and integration with the existing scaffold orchestration.

Exclude changes to Clack prompt behavior, generated template output, release workflow, package version bumps, and broad non-interactive scaffold mode.

## Implementation

1. Install `commander` as an exact runtime dependency.
2. Add a project-owned CLI parser module that creates local Commander `Command` instances instead of using global Commander state.
3. Configure command name, version metadata, help behavior, and parser output/exit handling so tests can run without process exits.
4. Route `--version` through Commander before interactive prompts, generation, dependency installation, or git initialization.
5. Keep the no-argument path wired to the existing interactive scaffold flow.
6. Update existing version flag tests or add parser-level tests proving `--version` prints package version and does not trigger scaffold side effects.
7. Add or keep coverage for the no-argument scaffold path to prevent parser integration from changing default behavior.

## Verification

Run:

```bash
npm run test
npm run build
```

Expected result:

- `--version` prints the current package version through Commander-managed parsing.
- Version flag path exits before prompts and generation side effects.
- No-argument CLI path still starts the existing interactive scaffold flow.
- Build succeeds with Commander included in the published CLI output.

## Rollback

Remove the Commander parser module and runtime dependency, then restore direct argv handling for supported flags. Keep prompt, generation, transform, and post-setup modules unchanged.

## Related

- ADR-022: Use Commander for CLI argument parsing
- ADR-012: Use Clack for interactive CLI prompts
- FEATURE-00001: Support version flag
- CHANGE-031: Support version flag
