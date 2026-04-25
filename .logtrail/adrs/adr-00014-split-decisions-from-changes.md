# ADR-014: Split decisions from changes

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-04-16 |

## Context

ADR files currently combine durable decisions with implementation plans. That makes every planned implementation look architectural, even when a change only needs task-level execution detail.

The current model also puts delivery state on ADRs through the `Implemented` status. Decision state and implementation state move at different speeds: one ADR can need multiple implementation changes, one change can satisfy several ADRs, and many changes should not create ADRs at all.

The project now needs a process that keeps ADRs stable while still giving LLM agents explicit, reviewable implementation plans.

## Decision

Store durable architecture decisions as flat ADR files under `doadrs/adr-NNNNN-title-slug.md`.

Store implementation plans and delivery records as flat change files under `dochanges/change-NNNNN-title-slug.md`.

Keep decision status on ADRs and delivery status on changes. ADR statuses are:

- `Proposed`
- `Accepted`
- `Rejected`
- `Deprecated`
- `Superseded`

Change statuses are:

- `Proposed`
- `In Progress`
- `Done`
- `Blocked`
- `Abandoned`

Use `docs/adl.md` as the decision log and `docs/changes.md` as the change log.

Do not create ADR plan files. ADR-backed implementation work must use a CHANGE file linked to the relevant ADR. Non-ADR implementation plans may also use CHANGE files when task-level planning is useful.

## Consequences

Positive:

- ADRs stay focused on durable decisions.
- Implementation plans can exist without forcing an ADR.
- Delivery state is tracked where implementation work lives.
- One ADR can be implemented by multiple changes, and one change can reference multiple ADRs.

Negative:

- The docs workflow has one more artifact type.
- Agents must choose between ADR and CHANGE before writing planning docs.
- Existing ADR paths and plan links need a one-time migration.

## Alternatives Considered

- Keep ADR implementation plans next to ADRs: simpler file layout, but keeps decision and delivery state coupled.
- Add standalone change files only for non-ADR work: less migration, but leaves two competing plan formats.
- Keep `Implemented` as an ADR status: preserves existing history, but continues mixing decision acceptance with delivery completion.

## Reversibility

This decision can be superseded by a later ADR that restores nested ADR directories or a different planning artifact. Existing CHANGE records can be linked back from ADRs or folded into PR history if the project no longer wants persistent implementation plans.

## Implemented By

- [CHANGE-014](./changes/change-00014-split-decisions-from-changes.md)
