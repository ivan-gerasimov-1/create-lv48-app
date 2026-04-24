---
name: Logtrail | Prepare Change
description: Create a new Proposed CHANGE record for ADR-backed or standalone implementation work
---

Use the text after this skill invocation as the change brief.

Use this skill only to prepare CHANGE documentation. Inspect code as needed, but write only CHANGE docs and `docs/changes.md`.

## Resources

- Use `assets/CHANGE-TEMPLATE.md` as the CHANGE template.

## Workflow

1. If the brief does not identify implementation work, ask for the change topic before creating files.
2. Read `docs/changes.md`, `docs/adl.md`, relevant ADRs/docs/code, and inspect current state.
3. Determine whether the change is ADR-backed or standalone:
   - If the brief references ADRs, verify that each ADR exists.
   - Prefer ADR-backed changes when implementation work follows an `Accepted` ADR.
   - Use standalone changes for non-ADR task plans that need scope, steps, verification, and rollback.
4. Determine CHANGE number:
   - Use an explicit number only when it appears at the start of input, after optional whitespace.
   - Supported prefixes: `CHANGE-014`, `CHANGE 014`, `C-014`, `#14`, `#014`, `014`, `14`.
   - Normalize to five digits: `#14 Split decisions` -> `CHANGE-00014`, `docs/changes/change-00014-split-decisions.md`.
   - Do not scan the input body for CHANGE numbers.
   - If no starting number exists, use max `CHANGE-NNNNN` from `docs/changes.md` + 1.
5. Stop if `docs/changes/change-NNNNN-title-slug.md` already exists.
6. Present a rough approach before writing:
   - goal
   - ADR links or standalone rationale
   - scope
   - implementation shape
   - verification
   - rollback
7. Ask clarifying questions only when the answer changes scope, compatibility, verification, or rollback.
8. Create `docs/changes/change-NNNNN-title-slug.md` from `assets/CHANGE-TEMPLATE.md`.
9. Save CHANGE and `docs/changes.md` entry with status `Proposed`.
10. Stop after docs/status changes. Do not implement code.

## Guardrails

- Do not change implementation code, ADR files, configs, or tests.
- Do not overwrite existing CHANGE files.
- Do not mark CHANGE as `Done`.
- Do not treat numbers in input body as CHANGE numbers.
- Linking to a `Rejected`, `Deprecated`, or `Superseded` ADR requires explicit user confirmation.
