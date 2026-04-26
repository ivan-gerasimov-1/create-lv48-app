# ADR-021: Rename Logtrail to Backtrail

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-04-26 |

## Context

The repository currently uses `Logtrail` as the name for the ADR and CHANGE workflow, supporting agent skills, trail directory, templates, and related references. The name appears in user-facing skill names and in repository paths such as `.logtrail/`.

The project now needs the same workflow to use `Backtrail` as the canonical name. This is a durable naming and structure decision because it affects future documentation, agent skill names, path references, and any extraction or reuse of the workflow outside this repository.

Renaming only some references would create two competing names for one workflow. Future work needs one canonical term so docs, skills, and implementation plans stay searchable and predictable.

## Decision

Rename the Logtrail workflow and related files/assets to Backtrail.

Canonical naming after implementation:

- Product/workflow name: `Backtrail`
- Skill names: `Backtrail | Prepare ADR`, `Backtrail | Prepare Change`, and `Backtrail | Implement`
- Trail root: `.backtrail/`
- ADR log: `.backtrail/adl.md`
- CHANGE log: `.backtrail/changes.md`
- ADR records: `.backtrail/adrs/adr-NNNNN-title-slug.md`
- CHANGE records: `.backtrail/changes/change-NNNNN-title-slug.md`

Implementation must update live references together, including:

- agent skill directories, skill metadata, templates, and workflow docs
- project docs that point to the decision or change logs
- current ADR and CHANGE index links required for navigation
- active implementation records that reference the old live paths

Historical ADR and CHANGE prose may keep `Logtrail` where it describes past decisions. Live navigation, current process instructions, and future-facing rules must use `Backtrail`.

## Consequences

Positive:

- The workflow has one canonical name for future docs, skills, and assets.
- Backtrail can be extracted or reused without carrying the old Logtrail brand.
- Search and onboarding become clearer after the rename is complete.

Negative:

- The rename touches hidden paths, skill references, markdown links, and likely many historical records.
- Existing open threads, local references, or external references to `.logtrail/` can break until updated.
- Historical records need careful handling so old context remains understandable while live links point to current paths.

## Alternatives Considered

- Keep `Logtrail`: lowest churn, but does not satisfy the requested product/workflow rename and leaves future assets on the old name.
- Rename display text only: smaller change, but leaves paths and skill assets on the old name, creating split terminology.
- Add `Backtrail` as an alias for `Logtrail`: easier compatibility, but increases ambiguity and requires future work to support both names.

## Reversibility

This decision is reversible because it affects repository docs, agent skills, templates, and path references rather than runtime user data.

Rollback by superseding this ADR and moving Backtrail names and paths back to Logtrail equivalents:

- `.backtrail/` back to `.logtrail/`
- Backtrail skill directories and names back to Logtrail
- live docs, links, and templates back to Logtrail references

During rollback, preserve historical records and add a superseding ADR rather than rewriting accepted decision history.

## Related Decisions

- [ADR-014: Split decisions from changes](./adr-00014-split-decisions-from-changes.md) defines the ADR and CHANGE artifact split.
- [ADR-016: Use kebab-case names for decision and change docs](./adr-00016-use-kebab-case-names-for-decision-and-change-docs.md) defines the current filename style and five-digit numbering.
- [ADR-018: Move Logtrail docs to .logtrail directory](./adr-00018-move-logtrail-docs-to-logtrail-directory.md) defines the current Logtrail root that this decision replaces.
