# CHANGE-016: Use kebab-case names for decision and change docs

| Status | Date       | ADRs                                                                              |
| ------ | ---------- | --------------------------------------------------------------------------------- |
| Done   | 2026-04-23 | [ADR-016](../adrs/adr-00016-use-kebab-case-names-for-decision-and-change-docs.md) |

## Goal

Adopt canonical kebab-case paths for decision and change docs, including descriptive five-digit record filenames and workflow updates that keep all live references consistent.

## Scope

Update documentation and process artifacts only.

Include decision and change log renames, ADR and CHANGE record renames, reference updates across docs and agent workflow artifacts, and workflow rule updates for future record creation.

Do not change runtime code, generated output, package contracts, or template behavior.

## Implementation

1. Rename the log files from `docs/ADL.md` to `docs/adl.md` and from `docs/CHANGES.md` to `docs/changes.md`.
2. Rename every ADR record to `docs/adrs/adr-NNNNN-title-slug.md` and every CHANGE record to `docs/changes/change-NNNNN-title-slug.md`.
3. Keep decision and change numbers zero-padded to five digits and derive each `title-slug` from the document title in lowercase kebab-case.
4. Update all live references in repository docs and process artifacts, including:
   - `README.md`
   - `docs/engineering-conventions.md`
   - ADR and CHANGE log tables
   - ADR and CHANGE cross-links, related links, rollback text, and historical prose that still points at current canonical paths
   - agent skill docs and templates under `.agents/skills/**` that still reference uppercase paths, uppercase record names, or three-digit normalization rules
5. Remove old uppercase canonical paths instead of keeping compatibility duplicates, aliases, or redirects.

## Verification

Run:

```bash
rg -n "docs/ADL\\.md|docs/CHANGES\\.md|docs/adrs/ADR-|docs/changes/CHANGE-|ADR-NNN|CHANGE-NNN" .
npm run test
```

Expected result:

- No old canonical decision or change doc references remain.
- Renamed logs and record files use lowercase kebab-case paths with five-digit numbers.
- Repository tests still pass after the documentation and workflow artifact updates.

## Rollback

Rename the decision log, change log, ADR files, and CHANGE files back to the current uppercase three-digit paths and restore all affected references in docs and agent workflow artifacts to the pre-migration names.
