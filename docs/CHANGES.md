# Change Log

This log tracks implementation plans and delivery records for the project.

Use CHANGE records for ADR-backed implementation plans and for non-ADR task plans that need durable execution context.

## Process

- Create a CHANGE record when implementation work needs explicit scope, steps, verification, and rollback.
- Link ADR-backed changes to the relevant ADRs.
- Use standalone CHANGE records for non-ADR implementation plans when a commit, issue, or pull request note is not enough.
- Store each change in `docs/changes/CHANGE-NNN.md`.
- Use ISO dates in `YYYY-MM-DD` format.

## Status Values

- `Proposed`: planned but not started.
- `In Progress`: being implemented.
- `Done`: implemented and verified.
- `Blocked`: waiting on an external decision or prerequisite.
- `Abandoned`: no longer planned or applicable.

## Changes

| Change                                | Date       | Status    | ADRs                         | Title                                                 |
| ------------------------------------- | ---------- | --------- | ---------------------------- | ----------------------------------------------------- |
| [CHANGE-001](./changes/CHANGE-001.md) | 2026-04-14 | Done      | [ADR-001](./adrs/ADR-001.md) | Use Vitest for tests                                  |
| [CHANGE-002](./changes/CHANGE-002.md) | 2026-04-14 | Done      | [ADR-002](./adrs/ADR-002.md) | Colocate test files with tested code                  |
| [CHANGE-003](./changes/CHANGE-003.md) | 2026-04-14 | Done      | [ADR-003](./adrs/ADR-003.md) | Support single and multi-project workspace layouts    |
| [CHANGE-004](./changes/CHANGE-004.md) | 2026-04-15 | Done      | [ADR-004](./adrs/ADR-004.md) | Use tsdown for CLI builds                             |
| [CHANGE-005](./changes/CHANGE-005.md) | 2026-04-15 | Done      | [ADR-005](./adrs/ADR-005.md) | Validate package before publish                       |
| [CHANGE-006](./changes/CHANGE-006.md) | 2026-04-15 | Done      | [ADR-006](./adrs/ADR-006.md) | Avoid project-owned index files                       |
| [CHANGE-007](./changes/CHANGE-007.md) | 2026-04-15 | Done      | [ADR-007](./adrs/ADR-007.md) | Migrate templates to Vite 8 and Rolldown-backed Astro |
| [CHANGE-008](./changes/CHANGE-008.md) | 2026-04-15 | Done      | [ADR-008](./adrs/ADR-008.md) | Include shadcn v4 in base web template                |
| [CHANGE-009](./changes/CHANGE-009.md) | 2026-04-16 | Done      | [ADR-009](./adrs/ADR-009.md) | Use typed portable template definitions               |
| [CHANGE-010](./changes/CHANGE-010.md) | 2026-04-16 | Done      | [ADR-010](./adrs/ADR-010.md) | Rename template identifier to name                    |
| [CHANGE-011](./changes/CHANGE-011.md) | 2026-04-16 | Abandoned | [ADR-011](./adrs/ADR-011.md) | Use template terminology consistently                 |
| [CHANGE-012](./changes/CHANGE-012.md) | 2026-04-16 | Done      | [ADR-012](./adrs/ADR-012.md) | Use Clack for interactive CLI prompts                 |
| [CHANGE-013](./changes/CHANGE-013.md) | 2026-04-16 | Done      | [ADR-013](./adrs/ADR-013.md) | Restrict default parameters to simple literals        |
| [CHANGE-014](./changes/CHANGE-014.md) | 2026-04-16 | Done      | [ADR-014](./adrs/ADR-014.md) | Split decisions from changes                          |
| [CHANGE-015](./changes/CHANGE-015.md) | 2026-04-16 | Done      | [ADR-015](./adrs/ADR-015.md) | Use class-based post-setup orchestration              |
| [CHANGE-016](./changes/CHANGE-016.md) | 2026-04-23 | Proposed  | [ADR-016](./adrs/ADR-016.md) | Use kebab-case names for decision and change docs     |
