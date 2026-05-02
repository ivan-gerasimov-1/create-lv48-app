# FEATURE-00003: Update checker

| Status   | Date       |
| -------- | ---------- |
| Proposed | 2026-05-02 |

## Context

`create-lv48-app` is distributed as a CLI initializer. Users may run an older installed or cached version and miss template fixes, onboarding improvements, or compatibility updates.

## Goal

Notify users when a newer CLI version is available without blocking project creation.

## Users / Use Cases

- User: run the initializer and see that a newer version is available before or after setup.
- Maintainer: guide users toward current templates and reduce reports from stale CLI versions.
- Automation user: run setup without unexpected interactive upgrade prompts.

## Scope

- Detect whether the current CLI version is older than the latest available package version.
- Show a concise, non-blocking update notice with the current version, latest version, and suggested upgrade command.
- Avoid automatic package upgrades.
- Avoid making project generation fail only because update lookup is unavailable.
- Provide a way to skip or disable the check for automation or offline usage.

## Non-Goals

- Do not automatically install newer CLI versions.
- Do not change generated template content.
- Do not require network access for normal project generation.
- Do not add telemetry or usage tracking.

## Acceptance Criteria

- Given a newer CLI version is available, when the user runs the initializer, then the CLI displays a clear update notice and continues normal setup.
- Given the update lookup fails, when the user runs the initializer, then project generation can continue without an update-check failure.
- Given update checking is disabled, when the user runs the initializer, then no package-version lookup is attempted.
- Given the current version is latest, when the user runs the initializer, then no noisy update warning is shown.

## Dependencies

- Existing CLI version lookup.
- Package registry version source.
- CLI argument handling for skip/disable behavior.

## Risks / Rollback

Network checks can slow startup, fail in offline environments, or create noisy output. The feature should be additive and non-blocking.

Rollback is reversible by removing the update-check step and retaining normal CLI creation behavior.

## Related Features / ADRs

- FEATURE-00001 Support version flag
