# Architectural Decision Log

This log tracks architecture decisions for the project.

Use ADRs for durable decisions that affect architecture, repository structure, public contracts, generated output, build/test workflow, dependencies, or reversibility. Use CHANGE records for implementation plans and delivery state.

## Process

- Create a new ADR when a decision is expected to outlive the immediate change.
- Before creating an ADR, confirm that the decision constrains future work, changes a public contract or project structure, rejects a viable alternative, or has meaningful rollback cost.
- Do not create ADRs for routine bug fixes, local refactors, test additions, implementation details of an existing ADR, copy changes, dependency patch updates, or choices that only matter inside one task.
- Use a commit, issue, pull request note, or CHANGE record when the change needs context but does not establish a durable project rule.
- Store each decision in `docs/adrs/ADR-NNN.md`.
- Store implementation plans and delivery records in `docs/changes/CHANGE-NNN.md`.
- Keep accepted ADRs immutable except for typo, link, status, and change-log updates.
- If a decision changes, create a new ADR and mark the old ADR as `Superseded`.
- Use ISO dates in `YYYY-MM-DD` format.

## Status Values

- `Proposed`: under discussion and not yet binding.
- `Accepted`: chosen and binding for new work.
- `Deprecated`: still historically valid, but no longer recommended for new work.
- `Superseded`: replaced by a newer ADR.
- `Rejected`: not chosen.

## Decisions

| ADR                                  | Date       | Status   | Related                              | Title                                                 |
| ------------------------------------ | ---------- | -------- | ------------------------------------ | ----------------------------------------------------- |
| [ADR-001](./adrs/ADR-001.md)         | 2026-04-14 | Accepted | [ADR-002](./adrs/ADR-002.md)         | Use Vitest for tests                                  |
| [ADR-002](./adrs/ADR-002.md)         | 2026-04-14 | Accepted | [ADR-001](./adrs/ADR-001.md)         | Colocate test files with tested code                  |
| [ADR-003](./adrs/ADR-003.md)         | 2026-04-14 | Accepted | -                                    | Support single and multi-project workspace layouts    |
| [ADR-004](./adrs/ADR-004.md)         | 2026-04-15 | Accepted | -                                    | Use tsdown for CLI builds                             |
| [ADR-005](./adrs/ADR-005.md)         | 2026-04-15 | Accepted | [ADR-004](./adrs/ADR-004.md)         | Validate package before publish                       |
| [ADR-006](./adrs/ADR-006.md)         | 2026-04-15 | Accepted | -                                    | Avoid project-owned index files                       |
| [ADR-007](./adrs/ADR-007.md)         | 2026-04-15 | Accepted | -                                    | Migrate templates to Vite 8 and Rolldown-backed Astro |
| [ADR-008](./adrs/ADR-008.md)         | 2026-04-15 | Accepted | -                                    | Include shadcn v4 in base web template                |
| [ADR-009](./adrs/ADR-009.md)         | 2026-04-16 | Accepted | -                                    | Use typed portable template definitions               |
| [ADR-010](./adrs/ADR-010.md)         | 2026-04-16 | Accepted | [ADR-009](./adrs/ADR-009.md)         | Rename template identifier to name                    |
| [ADR-011](./adrs/ADR-011.md)         | 2026-04-16 | Rejected | [ADR-009](./adrs/ADR-009.md)         | Use template terminology consistently                 |
| [ADR-012](./adrs/ADR-012.md)         | 2026-04-16 | Accepted | -                                    | Use Clack for interactive CLI prompts                 |
| [ADR-013](./adrs/ADR-013.md)         | 2026-04-16 | Accepted | [ADR-012](./adrs/ADR-012.md)         | Restrict default parameters to simple literals        |
| [ADR-014](./adrs/ADR-014.md)         | 2026-04-16 | Accepted | -                                    | Split decisions from changes                          |
| [ADR-015](./adrs/ADR-015.md)         | 2026-04-16 | Accepted | -                                    | Use class-based post-setup orchestration              |
| [ADR-016](./adrs/ADR-016.md)         | 2026-04-23 | Accepted | [ADR-014](./adrs/ADR-014.md)         | Use kebab-case names for decision and change docs     |
