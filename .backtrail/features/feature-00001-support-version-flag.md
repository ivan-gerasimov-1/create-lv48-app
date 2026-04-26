# FEATURE-00001: Support version flag

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-04-26 |

## Context

`create-lv48-app` is a published CLI. Users and automation need a fast way to inspect the installed CLI version without starting the interactive scaffold flow.

The project previously had `--version` handling that was removed by `CHANGE-00018`. Restoring version visibility should keep normal scaffold behavior unchanged while making package identity observable again.

## Goal

Support a `--version` CLI flag that prints the current `create-lv48-app` package version and exits without prompting, scaffolding files, installing dependencies, or initializing git.

## Users / Use Cases

- CLI user: run `create-lv48-app --version` to confirm which package version is installed.
- Release or support workflow: capture CLI version output when debugging reports or verifying local install state.
- Automation: call the flag as a low-cost health check before running broader CLI flows.

## Scope

- Add user-facing `--version` behavior to the CLI entrypoint.
- Print one version value derived from package metadata for the currently installed package.
- Exit the version path before interactive prompts and generation side effects.
- Preserve existing no-flag scaffold behavior.
- Cover the flag behavior with tests.

## Non-Goals

- Do not change package release, changelog, or version bump workflow.
- Do not change generated project package versions.
- Do not introduce a broad CLI command framework unless implementation work proves existing parsing insufficient.
- Do not require network access to resolve version data.

## Acceptance Criteria

- Given a user runs `create-lv48-app --version`, when the CLI starts, then it prints the current package version and does not ask interactive questions.
- Given `--version` is provided, when the command completes, then no scaffold files are written and no post-setup commands run.
- Given the package version changes during release, when the published CLI is run with `--version`, then output reflects the package metadata in that published artifact.
- Given a user runs `create-lv48-app` without `--version`, when the CLI starts, then the existing interactive scaffold flow still runs.
- Given tests run, when version flag coverage executes, then it verifies output and no prompt/generation side effects.

## Dependencies

- CLI entrypoint argument handling.
- Package metadata availability in source, build output, or publish artifact.
- `CHANGE-00018` removed prior version flag behavior and is relevant rollback/history context.

## Risks / Rollback

Primary risk is version output drifting from package metadata if implementation hardcodes or bundles the value incorrectly. Secondary risk is flag parsing intercepting unrelated scaffold input.

Rollback is reversible: remove version flag handling and related tests, returning the CLI to prompt-first behavior documented after `CHANGE-00018`.

## Related Features / ADRs

- CHANGE-00018: Remove version flag
