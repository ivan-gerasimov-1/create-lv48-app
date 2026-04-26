---
name: Backtrail | Create CHANGE
description: Create a new Proposed CHANGE record for ADR-backed, FEATURE-backed, or standalone implementation work
---

## Purpose

Use this skill only to create CHANGE documentation. Inspect code as needed, but write only CHANGE docs and `.backtrail/changes.md`.

A CHANGE record describes concrete implementation work. It may be backed by an Accepted ADR or FEATURE, or it may stand alone when no new durable decision is needed.

## Input

Use the text after this skill invocation as the change brief.

## Resources

- Use `assets/change-template.md` as the CHANGE template.

## Workflow

1. If the brief does not identify implementation work, ask for the change topic before creating files.
2. Read `.backtrail/changes.md`, `.backtrail/adl.md`, `.backtrail/features.md`, relevant FEATURE, ADR, and CHANGE docs, then inspect current state. If `.backtrail/changes.md` or `.backtrail/changes/` is missing, plan to create it.
3. Apply the CHANGE gate before creating files.
   - If the brief references ADRs, verify that each ADR exists and is `Accepted`.
   - If the brief references FEATUREs, verify they exist. Prefer an `Accepted` FEATURE before creating implementation CHANGE records.
   - Use ADR- or FEATURE-backed changes when implementation work follows an `Accepted` ADR or FEATURE.
   - If the work introduces or changes a durable decision that constrains future work, architecture, repository structure, public contracts, generated output, build/test workflow, dependencies, or reversibility, stop and explain that ADR Create must run first.
   - Use standalone changes only for concrete implementation work that does not need a new ADR: routine bug fixes, local refactors, test additions, implementation details of an existing ADR, copy changes, dependency patch updates, or choices that only matter inside one task.
4. Determine the CHANGE number.
   - Use an explicit number only when it appears at the start of input, after optional whitespace.
   - Supported prefixes: `CHANGE-014`, `CHANGE 014`, `C-014`, `#14`, `#014`, `014`, `14`.
   - Normalize to five digits: `#14 Split decisions` -> `CHANGE-00014`, `.backtrail/changes/change-00014-split-decisions.md`.
   - Do not scan the input body for CHANGE numbers.
   - If no starting number exists, use the highest `CHANGE-NNNNN` from `.backtrail/changes.md` + 1.
   - If `.backtrail/changes.md` is missing, create it and start at `CHANGE-00001` unless the brief has an explicit starting number.
5. Stop if `.backtrail/changes/change-NNNNN-title-slug.md` already exists.
6. Present a rough approach before writing.
   - goal
   - ADR links or standalone rationale
   - scope
   - implementation shape
   - verification
   - rollback
7. Ask clarifying questions only when the answer changes scope, compatibility, verification, or rollback.
8. Create `.backtrail/changes/change-NNNNN-title-slug.md` from `assets/change-template.md`.
   - If the estimated implementation diff exceeds 500 lines, create several subsequent CHANGE files, each blocked by the previous record.
9. Save the CHANGE and its `.backtrail/changes.md` entry with status `Proposed`.
10. Stop after docs/status changes. Do not implement code.

## Question UX

- When asking the user to choose between two or three meaningful options, use `request_user_input` when available.
- For yes/no decisions, present `Yes` and `No` choices.
- If `request_user_input` is unavailable, ask one concise plain-text question with numbered choices.
- Do not claim that a skill can switch modes or force button rendering.

## Guardrails

- Do not change implementation code, ADR files, configs, or tests.
- Do not overwrite existing CHANGE files.
- Do not mark CHANGE as `Done`.
- Do not treat numbers in input body as CHANGE numbers.
- Do not create standalone CHANGE records for work that needs a new ADR first. Stop and explain why ADR Create is required.
- Linking to a `Rejected`, `Deprecated`, or `Superseded` ADR requires explicit user confirmation.
