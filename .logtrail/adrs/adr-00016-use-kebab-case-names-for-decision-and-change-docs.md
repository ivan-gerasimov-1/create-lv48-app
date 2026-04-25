# ADR-016: Use kebab-case names for decision and change docs

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-04-23 |

## Context

The project currently stores decision and change docs under mixed naming styles:

- `docs/adl.md`
- `docs/changes.md`
- `doadrs/adr-NNNNN-title-slug.md`
- `dochanges/change-NNNNN-title-slug.md`

That layout is readable, but it does not follow the repository preference for lowercase, path-stable filenames. It also forces every new ADR and CHANGE workflow to preserve uppercase names without titles in filenames, which makes links less descriptive and file lists harder to scan.

The project already split durable decisions from implementation plans in [ADR-014: Split decisions from changes](./adr-00014-split-decisions-from-changes.md). This new decision should refine naming only. It should not change the ADR vs CHANGE model, runtime behavior, generated output, or public package contracts.

## Decision

Use kebab-case names for decision and change docs.

Canonical paths become:

- `docs/adl.md`
- `docs/changes.md`
- `doadrs/adr-NNNNN-title-slug.md`
- `dochanges/change-NNNNN-title-slug.md`

Rules:

- Keep decision numbers and change numbers zero-padded to five digits.
- Derive `title-slug` from the document title in lowercase kebab-case.
- Future ADR and CHANGE creation workflows must treat these paths as canonical.
- Update all live references when this decision is implemented, including:
  - `README.md`
  - `docs/engineering-conventions.md`
  - ADR and CHANGE log prose and tables
  - ADR and CHANGE cross-links
  - agent skill docs and templates that reference current paths

This decision changes documentation process and repository structure only. It does not change runtime behavior, generated project output, or published package interfaces.

## Consequences

Positive:

- Filenames become consistent with the repository naming preference.
- ADR and CHANGE file lists become easier to scan because filenames include both number and title.
- Future links can be more descriptive without changing ADR and CHANGE identifiers.

Negative:

- Existing docs and workflow references require a coordinated rename pass.
- Historical links and scripts that expect uppercase paths must be updated together.
- The migration introduces short-term churn in documentation-only files.

## Alternatives Considered

- Keep the current uppercase filenames: lowest immediate churn, but keeps mixed naming and less descriptive file paths.
- Rename only the index files: smaller migration, but leaves ADR and CHANGE record names inconsistent.
- Rename only ADR and CHANGE records: improves scanability, but leaves the log files inconsistent with the new naming policy.

## Reversibility

This decision is reversible.

If the filename migration creates too much noise or maintenance cost, rename the files and references back to:

- `docs/ADL.md`
- `docs/CHANGES.md`
- `doadrs/ADR-NNN.md`
- `dochanges/CHANGE-NNN.md`

Rollback does not require runtime or data migration because the decision affects repository documentation paths only.

## Related Decisions

- [ADR-014: Split decisions from changes](./adr-00014-split-decisions-from-changes.md) remains accepted and defines the artifact split that this ADR keeps.
