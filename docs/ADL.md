# Architectural Decision Log

This log tracks architecture decisions for the project.

Use ADRs for durable decisions that affect architecture, repository structure, public contracts, generated output, build/test workflow, dependencies, or reversibility.

## Process

- Create a new ADR from [ADR-TEMPLATE.md](./adrs/ADR-TEMPLATE.md) when a decision is expected to outlive the immediate change.
- Keep accepted ADRs immutable except for typo, link, status, and implementation-plan updates.
- If a decision changes, create a new ADR and mark the old ADR as `Superseded`.
- Store each decision in `docs/adrs/adr-NNN/` with `ADR-NNN.md` and, when implementation details are useful, `ADR-NNN_IMPLEMENTATION-PLAN.md`.
- Use ISO dates in `YYYY-MM-DD` format.

## Status Values

- `Proposed`: under discussion and not yet binding.
- `Accepted`: chosen but not fully implemented.
- `Implemented`: chosen and reflected in the codebase or docs.
- `Deprecated`: still historically valid, but no longer recommended for new work.
- `Superseded`: replaced by a newer ADR.

## Decisions

| ADR                                  | Date       | Status      | Implementation Plan                                   | Related                              | Title                                              |
| ------------------------------------ | ---------- | ----------- | ----------------------------------------------------- | ------------------------------------ | -------------------------------------------------- |
| [ADR-001](./adrs/adr-001/ADR-001.md) | 2026-04-14 | Implemented | [Plan](./adrs/adr-001/ADR-001_IMPLEMENTATION-PLAN.md) | [ADR-002](./adrs/adr-002/ADR-002.md) | Use Vitest for tests                               |
| [ADR-002](./adrs/adr-002/ADR-002.md) | 2026-04-14 | Implemented | [Plan](./adrs/adr-002/ADR-002_IMPLEMENTATION-PLAN.md) | [ADR-001](./adrs/adr-001/ADR-001.md) | Colocate test files with tested code               |
| [ADR-003](./adrs/adr-003/ADR-003.md) | 2026-04-14 | Implemented | [Plan](./adrs/adr-003/ADR-003_IMPLEMENTATION-PLAN.md) | -                                    | Support single and multi-project workspace layouts |
| [ADR-004](./adrs/adr-004/ADR-004.md) | 2026-04-15 | Implemented | [Plan](./adrs/adr-004/ADR-004_IMPLEMENTATION-PLAN.md) | -                                    | Use tsdown for CLI builds                          |
| [ADR-005](./adrs/adr-005/ADR-005.md) | 2026-04-15 | Implemented | [Plan](./adrs/adr-005/ADR-005_IMPLEMENTATION-PLAN.md) | [ADR-004](./adrs/adr-004/ADR-004.md) | Validate package before publish                    |
| [ADR-006](./adrs/adr-006/ADR-006.md) | 2026-04-15 | Implemented | [Plan](./adrs/adr-006/ADR-006_IMPLEMENTATION-PLAN.md) | -                                    | Avoid project-owned index files                    |
| [ADR-007](./adrs/adr-007/ADR-007.md) | 2026-04-15 | Accepted    | [Plan](./adrs/adr-007/ADR-007_IMPLEMENTATION-PLAN.md) | -                                    | Migrate templates to Vite 8 and Rolldown-backed Astro |
| [ADR-008](./adrs/adr-008/ADR-008.md) | 2026-04-15 | Accepted    | [Plan](./adrs/adr-008/ADR-008_IMPLEMENTATION-PLAN.md) | -                                    | Include shadcn v4 in base web template             |
