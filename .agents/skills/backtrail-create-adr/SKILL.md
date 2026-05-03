---
name: backtrail-create-adr
description: Create a Proposed ADR from decision input
---

## Purpose

Create ADR documentation only. Inspect code as needed, but write only ADR docs and `.backtrail/adl.md`.

ADR records durable decisions that constrain future work: architecture, repository structure, public contracts, generated output, build/test workflow, dependencies, or reversibility.

## Input

Use the text after this skill invocation as the decision brief.

## Resources

- Use `assets/adr-template.md` as the ADR template.

## Workflow

1. If the brief does not identify a decision, ask for the decision topic before creating files.
2. Read `.backtrail/adl.md`, relevant ADRs, docs, and code. If `.backtrail/adl.md` or `.backtrail/adrs/` is missing, plan to create it.
3. Apply the ADR gate before creating files.
   - Create ADRs only for durable decisions that constrain future work or change architecture, repository structure, public contracts, generated output, build/test workflow, dependencies, or reversibility.
   - Prefer commit, issue, PR note, or CHANGE for bug fixes, local refactors, tests, existing ADR implementation details, copy changes, dependency patches, or task-local choices.
   - If the gate fails, stop and explain why a non-ADR artifact fits better. Do not create ADR files.
4. Determine the ADR number.
   - Use an explicit number only when it appears at the start of input, after optional whitespace.
   - Supported prefixes: `ADR-014`, `ADR 014`, `#14`, `#014`, `014`, `14`.
   - Normalize to five digits: `#14 Split decisions` -> `ADR-00014`, `.backtrail/adrs/adr-00014-split-decisions.md`.
   - Do not scan the input body for ADR numbers.
   - If no starting number exists, use the highest `ADR-NNNNN` from `.backtrail/adl.md` + 1.
   - If `.backtrail/adl.md` is missing, create it and start at `ADR-00001` unless the brief has an explicit starting number.
5. Stop if `.backtrail/adrs/adr-NNNNN-title-slug.md` already exists.
6. Present rough approach before writing.
   - decision
   - key rationale
   - risks/rollback
   - related ADRs, if any
7. Ask only questions that change decision, scope, compatibility, verification, or rollback.
8. Create `.backtrail/adrs/adr-NNNNN-title-slug.md` from `assets/adr-template.md`.
9. Save the ADR and its `.backtrail/adl.md` entry with status `Proposed`.
10. Ask whether to promote to `Accepted`.
    - Use Yes/No buttons when `request_user_input` is available.
    - `Yes`: update status in the ADR and `.backtrail/adl.md`.
    - `No`: leave `Proposed`.
11. Ask whether to proceed with creating a CHANGE record.
    - Use Yes/No buttons when `request_user_input` is available.
    - `Yes`: use `backtrail-create-change`.
    - `No`: skip to the next step.
12. Stop after docs/status changes. Do not implement code.

## Question UX

- Use `request_user_input` when available for two or three meaningful choices.
- For yes/no decisions, present `Yes` and `No` choices.
- If `request_user_input` is unavailable, ask one concise plain-text question with numbered choices.
- Do not claim that a skill can switch modes or force button rendering.

## Guardrails

- Do not change implementation code, non-ADR templates, configs, or tests.
- Do not overwrite existing ADR files.
- Do not create CHANGE records; use the `backtrail-create-change` skill for implementation plans.
- Do not treat numbers in input body as ADR numbers.
- Superseding another ADR requires explicit user confirmation.
