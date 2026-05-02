# FEATURE-00006: Project bootstrap status

| Status   | Date       |
| -------- | ---------- |
| Proposed | 2026-05-02 |

## Context

`create-lv48-app` performs several setup steps: collecting answers, preparing the target directory, writing scaffold files, optionally installing dependencies, optionally initializing git, and printing a final summary. Users currently receive limited progress information while these steps run.

## Goal

Show clear bootstrap progress so users understand what the initializer is doing, what has completed, and what needs attention.

## Users / Use Cases

- User: see which setup step is currently running during project creation.
- User: identify whether failures happened during scaffolding, dependency install, or git initialization.
- Maintainer: produce clearer issue reports by making setup stages visible in output.

## Scope

- Display ordered status for major bootstrap stages.
- Mark completed, skipped, and failed optional steps clearly.
- Keep the final summary aligned with the status shown during execution.
- Preserve current scaffold behavior and generated output.
- Ensure status output remains useful in both successful and partially failed runs.

## Non-Goals

- Do not add a graphical UI.
- Do not estimate exact time remaining.
- Do not change generated template content.
- Do not make optional post-setup failures roll back successful scaffolding unless covered by a separate change.

## Acceptance Criteria

- Given the user starts project creation, when each major stage begins, then the CLI shows a clear stage label or status message.
- Given an optional post-setup step is skipped, when the summary is printed, then it is marked as skipped rather than failed.
- Given dependency installation or git initialization fails, when the summary is printed, then the failed step and manual next step guidance are visible.
- Given project creation succeeds, when the summary is printed, then completed stages and next commands are easy to scan.

## Dependencies

- Existing generation runner.
- Existing post-setup executor status model.
- Existing initialization summary output.
- CLI logging and prompt/status rendering.

## Risks / Rollback

Status output can become misleading if it is not tied to real execution states. More output may also be noisy for experienced users.

Rollback is reversible by removing stage-status rendering and keeping the current log and summary messages.

## Related Features / ADRs

- ADR-015 Use class-based post-setup orchestration
