# ADR-022: Use Commander for CLI argument parsing

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-04-26 |

## Context

`create-lv48-app` is a published CLI. FEATURE-00001 restores `--version` as a user-facing flag that must print package metadata and exit before prompts, scaffold writes, dependency installation, or git initialization.

The CLI currently starts the interactive scaffold flow directly from `runCli()`. Adding one custom `process.argv` check would satisfy `--version`, but it would keep argument parsing implicit and make future flags, help output, commands, and validation harder to keep consistent.

ADR-012 already chooses Clack for interactive prompts. That decision does not cover non-interactive argument parsing, automated help, version output, command validation, or future subcommands.

## Decision

Use `commander` as the CLI argument parsing and command definition layer.

Keep responsibilities separate:

- Commander owns non-interactive CLI surface area: options, commands, `--help`, `--version`, parsing, and argument validation.
- Clack remains the interactive prompt library for scaffold questions.
- Project code owns side-effect orchestration after parsed CLI intent is known.

Install Commander as an exact runtime dependency because the published CLI uses argument parsing at runtime.

Create local `Command` instances instead of using Commander global state so tests can parse isolated argv values and control output/exit behavior.

For FEATURE-00001, use Commander-managed version handling for `--version` and keep the no-argument path as the existing interactive scaffold flow.

## Consequences

Positive:

- CLI flags and commands get one explicit parsing boundary.
- `--version` and future `--help` behavior can use a maintained parser instead of custom argv checks.
- Future non-interactive modes or subcommands can grow without mixing parser logic into scaffold orchestration.
- Tests can exercise parser decisions independently from prompt and generation side effects.

Negative:

- The published CLI gains another runtime dependency.
- Commander-owned help, error, and exit behavior must be wrapped or configured for deterministic tests.
- Parser behavior becomes part of the user-facing contract, so future command changes need compatibility review.

## Alternatives Considered

- Keep custom argv checks: lowest dependency count and enough for one flag, but it leaves no durable command boundary and repeats concerns already solved by CLI parsers.
- Use `yargs`: mature and feature-rich for command-heavy CLIs, but heavier than this scaffold CLI needs now.
- Use `clipanion`: strong command modeling and modern TypeScript ergonomics, but more framework-shaped than needed for the current flag and near-term command surface.
- Use `cac`: small and common in Vite-adjacent tooling, but Commander has broader documentation, built-in TypeScript declarations, zero runtime dependencies, version handling, help output, and command support.

## Reversibility

Rollback by superseding this ADR, removing Commander from runtime dependencies, and replacing the parser boundary with explicit argv handling or another parser.

Keep `runCli()` scaffold orchestration separable from parser construction so rollback does not require changing prompt, generation, transform, or post-setup modules.

## Related Decisions

- [ADR-012](./adr-00012-use-clack-for-interactive-cli-prompts.md)
