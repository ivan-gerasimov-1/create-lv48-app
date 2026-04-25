# CHANGE-022: Move Logtrail docs to .logtrail directory

| Status   | Date       | ADRs                                                                          |
| -------- | ---------- | ----------------------------------------------------------------------------- |
| Proposed | 2026-04-25 | [ADR-018](../adrs/adr-00018-move-logtrail-docs-to-logtrail-directory.md)      |

## Goal

Implement [ADR-018](../adrs/adr-00018-move-logtrail-docs-to-logtrail-directory.md) by moving Logtrail trail docs from `docs/` to `.logtrail/` and updating live references to the new canonical paths.

## Scope

Included:

- Move `docs/adl.md` to `.logtrail/adl.md`.
- Move `docs/changes.md` to `.logtrail/changes.md`.
- Move `docs/adrs/` to `.logtrail/adrs/`.
- Move `docs/changes/` to `.logtrail/changes/`.
- Update live links and workflow references that point at Logtrail docs.
- Keep non-Logtrail project docs under `docs/`.

Excluded:

- Runtime code changes.
- Generated project output changes.
- Package export or CLI behavior changes.
- Rewriting historical rationale beyond link/path updates required by the move.

## Implementation

1. Create `.logtrail/`.
2. Move Logtrail index files and record directories into `.logtrail/`.
3. Update relative links inside moved ADR and CHANGE records so cross-links still resolve.
4. Update root and project documentation references that point to the decision log or change log.
5. Update Logtrail skill docs and templates to use `.logtrail/` as the canonical trail location.
6. Update this CHANGE status in `.logtrail/changes.md` after implementation and verification.

## Verification

Run:

```bash
rg -n "docs/(adl|changes)|docs/adrs|docs/changes" --hidden -g '!node_modules' -g '!dist' -g '!.git'
rg -n "\\.logtrail/(adl|changes)|\\.logtrail/adrs|\\.logtrail/changes" --hidden -g '!node_modules' -g '!dist' -g '!.git'
npm run test
```

Expected result:

- No live workflow or project-doc references still point to Logtrail docs under `docs/`.
- `.logtrail/` references point to the moved Logtrail docs.
- Tests pass.

Historical ADR and CHANGE content may still mention old paths when describing past state or rollback options.

## Rollback

Move Logtrail docs back to:

- `docs/adl.md`
- `docs/changes.md`
- `docs/adrs/adr-NNNNN-title-slug.md`
- `docs/changes/change-NNNNN-title-slug.md`

Then restore links and skill references to the previous `docs/` paths.
