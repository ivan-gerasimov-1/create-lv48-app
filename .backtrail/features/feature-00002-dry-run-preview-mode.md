# FEATURE-00002: Dry-run preview mode

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-05-02 |

## Context

`create-lv48-app` creates files, installs dependencies, and can initialize git. Users need a safe way to inspect what would happen before any side effects run.

## Goal

Let user preview scaffold plan without writing files or triggering post-setup actions.

## Users / Use Cases

- User: run `create-lv48-app --dry-run` to review planned output before creation.
- Support: confirm what CLI would do without touching filesystem.
- CI or automation: validate config and planned actions in a no-write mode.

## Scope

- Add `--dry-run` CLI flag.
- Show planned project details and actions.
- Skip file writes, dependency install, and git init.
- Keep normal scaffold flow unchanged when flag absent.
- Cover behavior with tests.

## Non-Goals

- Do not change generated template content.
- Do not add interactive confirmation flow.
- Do not persist preview output anywhere.

## Acceptance Criteria

- Given user runs `create-lv48-app --dry-run`, when CLI starts, then it prints preview output and exits without prompting.
- Given `--dry-run` is provided, when command completes, then no scaffold files are written and no post-setup commands run.
- Given user runs CLI without `--dry-run`, when CLI starts, then existing scaffold flow still runs.
- Given tests run, when dry-run coverage executes, then it verifies preview output and no side effects.

## Dependencies

- CLI argument handling.
- Generation path capable of describing planned work without executing it.
- Existing tests for CLI flow and generation behavior.

## Risks / Rollback

Primary risk is preview drift from actual generation output. Secondary risk is accidental side effects if dry-run branches too late in flow.

Rollback is reversible: remove `--dry-run` handling and related tests.

## Implemented By

Remove this section until a CHANGE record implements the feature.

- CHANGE-NNNNN

## Related Features / ADRs

- FEATURE-00001 Support version flag
- CHANGE-00043 Refactor application entrypoint
