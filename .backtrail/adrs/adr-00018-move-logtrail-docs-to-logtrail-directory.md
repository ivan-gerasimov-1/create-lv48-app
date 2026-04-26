# ADR-018: Move Logtrail docs to .logtrail directory

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-04-25 |

## Context

Logtrail-specific decision and change records currently live under the project-level `docs/` directory:

- `docs/adl.md`
- `docs/changes.md`
- `doadrs/adr-NNNNN-title-slug.md`
- `dochanges/change-NNNNN-title-slug.md`

That made sense while the ADR and CHANGE workflow was part of this repository only. The workflow is now becoming its own Logtrail concern, with dedicated agent skills and terminology. Keeping Logtrail process artifacts under the generic `docs/` directory makes project documentation and Logtrail trail state share one namespace.

The repository still needs ordinary project docs under `docs/`, such as engineering, development, release, product, and system docs. The Logtrail trail should be easier to identify, copy, archive, and eventually extract without mixing it with those docs.

## Decision

Move Logtrail-specific docs to a root `.logtrail/` directory.

Canonical Logtrail paths become:

- `.logtrail/adl.md`
- `.logtrail/changes.md`
- `.logtraadrs/adr-NNNNN-title-slug.md`
- `.logtrachanges/change-NNNNN-title-slug.md`

Keep non-Logtrail project documentation under `docs/`.

Future Logtrail skills and references must treat `.logtrail/` as the canonical trail location once this decision is implemented. The migration must update live references together, including:

- ADR and CHANGE links
- agent skill docs and templates
- project docs that point to the decision or change logs

This decision changes repository documentation structure only. It does not change runtime behavior, generated project output, package exports, or CLI behavior.

## Consequences

Positive:

- Logtrail trail state has a clear root directory.
- Project docs under `docs/` stop mixing durable project documentation with Logtrail process records.
- Future extraction or reuse of Logtrail artifacts can operate on one directory.

Negative:

- Existing links and skill references require a coordinated docs-only migration.
- Hidden directory naming makes the trail less visible in basic file listings.
- Existing accepted ADRs that mention `docs/adl.md`, `docs/changes.md`, `doadrs/`, or `dochanges/` need follow-up references or a newer decision if the path rule must be fully replaced.

## Alternatives Considered

- Keep Logtrail docs under `docs/`: lowest churn, but keeps project docs and trail state coupled.
- Move only ADR and CHANGE records, but keep `docs/adl.md` and `docs/changes.md`: smaller move, but splits one trail across two roots.
- Move all docs into `.logtrail/`: rejected because development, release, engineering, product, and system docs are project documentation, not trail state.

## Reversibility

This decision is reversible because it affects repository documentation paths only.

Rollback by moving the Logtrail files and references back to:

- `docs/adl.md`
- `docs/changes.md`
- `doadrs/adr-NNNNN-title-slug.md`
- `dochanges/change-NNNNN-title-slug.md`

No runtime or data migration is required.

## Related Decisions

- [ADR-014: Split decisions from changes](./adr-00014-split-decisions-from-changes.md) defines the ADR and CHANGE artifact split.
- [ADR-016: Use kebab-case names for decision and change docs](./adr-00016-use-kebab-case-names-for-decision-and-change-docs.md) defines the current filename style and five-digit numbering.
