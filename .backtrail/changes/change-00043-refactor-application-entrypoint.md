# CHANGE-00043: Refactor application entrypoint

| Status  | Date       | ADRs                                                                                                                            | Blocked By                                                                          | Blocks |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------ |
| Blocked | 2026-05-01 | [ADR-012](./adrs/adr-00012-use-clack-for-interactive-cli-prompts.md), [ADR-022](./adrs/adr-00022-use-commander-for-cli-argument-parsing.md) | [CHANGE-032](./changes/change-00032-use-commander-for-cli-argument-parsing.md) | -      |

## Goal

Refactor the application entrypoint so the published executable can route between the existing interactive prompt flow and a Commander-backed CLI command flow without mixing parser, prompt, and scaffold orchestration concerns.

## Scope

Included:

- Split the current `runCli()` path into explicit entrypoint orchestration, interactive prompt application flow, and CLI parser/command flow.
- Rename the top-level exported application entrypoint from `runCli()` to `cli()`.
- Preserve the no-argument behavior that starts the existing Clack-backed scaffold prompts.
- Route non-interactive flags and commands through Commander after CHANGE-032 provides the parser boundary.
- Keep shared scaffold execution logic behind a small application-level API so prompt and command flows can call the same generation, transform, post-setup, summary, and logging path.
- Add tests for entrypoint routing, no-argument prompt behavior, and Commander-handled CLI behavior.

Excluded:

- New user-facing CLI commands beyond the Commander/version behavior covered by CHANGE-032.
- Changes to prompt text, defaults, validation rules, generated template output, dependency installation behavior, or git initialization behavior.
- Broad package layout changes unrelated to entrypoint separation.

## Implementation

1. Introduce an application-level scaffold runner that accepts already-collected prompt/command options and owns generation, transform, post-setup, summary, and logging.
2. Move interactive answer collection into a dedicated prompt application flow that uses Clack through the existing prompt controller contract.
3. Move argv parsing and command dispatch into a dedicated Commander-backed CLI flow from CHANGE-032.
4. Keep the executable `main()` responsible only for calling the top-level entrypoint and handling unexpected errors.
5. Rename the exported top-level entrypoint to `cli()` and have it select the prompt flow for no arguments and the CLI flow for parsed flags or commands.
6. Add focused tests with injected argv, logger, prompt controller, and scaffold runner dependencies so routing can be verified without filesystem scaffolding side effects.
7. Keep existing scaffold behavior tests passing and add regression coverage for `--version` not starting prompts or generation.

## Verification

Run:

```bash
npm run test
npm run build
```

Expected result:

- No-argument execution still starts the existing interactive scaffold prompt flow.
- Commander-handled version/help paths exit before prompts, generation, dependency installation, or git initialization.
- Shared scaffold execution remains covered by existing behavior tests.
- TypeScript build succeeds with separated entrypoint, prompt flow, and CLI flow modules.

## Rollback

Restore the previous direct `runCli()` orchestration path, keep the Commander parser from CHANGE-032 if still needed, and reconnect `main()` to the single interactive scaffold flow. Remove only the routing modules and tests introduced by this change.

## Related

- ADR-012: Use Clack for interactive CLI prompts
- ADR-022: Use Commander for CLI argument parsing
- CHANGE-032: Use Commander for CLI argument parsing
