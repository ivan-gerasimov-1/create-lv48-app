# CHANGE-030: Rename Logtrail to Backtrail

| Status   | Date       | ADRs                                                        |
| -------- | ---------- | ----------------------------------------------------------- |
| Proposed | 2026-04-26 | [ADR-021](./adrs/adr-00021-rename-logtrail-to-backtrail.md) |

## Goal

Implement [ADR-021](./adrs/adr-00021-rename-logtrail-to-backtrail.md) by making Backtrail the canonical workflow name, trail root, skill name, and live reference set.

## Scope

Included:

- Move the trail root from `.logtrail/` to `.backtrail/`.
- Update ADR and CHANGE index process text to use `.backtrail/` paths for future records.
- Rename Logtrail agent skill directories to Backtrail equivalents.
- Update skill metadata, workflow instructions, templates, and examples to use Backtrail names and `.backtrail/` paths.
- Update project docs that point to the live ADR and CHANGE logs.
- Update live navigation and future-facing references inside current ADR and CHANGE records where old `.logtrail/` paths would be operationally wrong after the move.

Excluded:

- Rewriting historical ADR or CHANGE prose that describes past Logtrail decisions or prior paths.
- Changing ADR or CHANGE numbering, status semantics, or filename slug rules.
- Adding compatibility aliases for `.logtrail/`.
- Changing runtime CLI behavior, templates, generated app output, package metadata, or tests except where verification requires path-only documentation updates.

## Implementation

1. Move `.logtrail/` to `.backtrail/`.
2. Move `.agents/skills/logtrail-prepare-adr/`, `.agents/skills/logtrail-prepare-change/`, and `.agents/skills/logtrail-implement/` to Backtrail-named directories.
3. Update skill `name` metadata to `Backtrail | Prepare ADR`, `Backtrail | Prepare Change`, and `Backtrail | Implement`.
4. Update skill workflow text, templates, examples, and guardrails so future ADR and CHANGE work reads and writes `.backtrail/` paths.
5. Update `.backtrail/adl.md` and `.backtrail/changes.md` process text so new records use `.backtrail/adrs/` and `.backtrail/changes/`.
6. Add this CHANGE entry to the renamed change log and keep status `In Progress` during implementation.
7. Update live project documentation links, including `docs/engineering-conventions.md`, from `.logtrail/adl.md` to `.backtrail/adl.md`.
8. Search for stale live references to `Logtrail`, `logtrail`, and `.logtrail`; keep only historical context where ADR-021 explicitly allows it.
9. After verification passes, update this CHANGE file and `.backtrail/changes.md` to `Done`.

## Verification

Run:

```bash
rg -n "Logtrail|logtrail|\\.logtrail" --hidden -g '!node_modules' -g '!dist' -g '!.git'
npm run test
```

Expected result:

- No live workflow instructions, skill metadata, templates, or project docs still use the Logtrail name or `.logtrail/` paths.
- Remaining `Logtrail` or `.logtrail/` matches are historical ADR and CHANGE prose or ADR-021 rollback/context references.
- Backtrail skill docs point at `.backtrail/adl.md`, `.backtrail/changes.md`, `.backtrail/adrs/`, and `.backtrail/changes/`.
- Test suite passes.

## Rollback

Move `.backtrail/` back to `.logtrail/`, rename Backtrail skill directories and metadata back to Logtrail, restore live docs and skill instructions to `.logtrail/` paths, and update this CHANGE plus the change index to `Abandoned` or supersede ADR-021 if rollback becomes the chosen direction.
