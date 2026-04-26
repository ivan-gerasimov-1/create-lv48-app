---
name: Backtrail | Create ADR
description: Create a new Proposed ADR from user-provided decision input
---

Use the text after this skill invocation as the decision brief.

Use this skill only to create ADR documentation. Inspect code as needed, but write only ADR docs and `.backtrail/adl.md`.

## Resources

- Use `assets/adr-template.md` as the ADR template.

## Workflow

1. If the brief does not identify a decision, ask for the decision topic before creating files.
2. Read `.backtrail/adl.md`, relevant ADRs/docs/code, and inspect current state.
3. Apply the ADR gate before creating files:
   - Create an ADR only for durable decisions that constrain future work, change architecture, repository structure, public contracts, generated output, build/test workflow, dependencies, or reversibility.
   - Favor a commit, issue, pull request note, or CHANGE record for routine bug fixes, local refactors, test additions, implementation details of an existing ADR, copy changes, dependency patch updates, or choices that only matter inside one task.
   - If the gate does not pass, stop and explain why a non-ADR artifact is the better fit. Do not create ADR files.
4. Determine ADR number:
   - Use an explicit number only when it appears at the start of input, after optional whitespace.
   - Supported prefixes: `ADR-014`, `ADR 014`, `#14`, `#014`, `014`, `14`.
   - Normalize to five digits: `#14 Split decisions` -> `ADR-00014`, `.backtrail/adrs/adr-00014-split-decisions.md`.
   - Do not scan the input body for ADR numbers.
   - If no starting number exists, use max `ADR-NNNNN` from `.backtrail/adl.md` + 1.
5. Stop if `.backtrail/adrs/adr-NNNNN-title-slug.md` already exists.
6. Present a rough approach before writing:
   - decision
   - key rationale
   - risks/rollback
   - related ADRs, if any
7. Ask clarifying questions only when the answer changes decision, scope, compatibility, verification, or rollback.
8. Create `.backtrail/adrs/adr-NNNNN-title-slug.md` from `assets/adr-template.md`.
9. Save ADR and `.backtrail/adl.md` entry with status `Proposed`.
10. Ask whether to promote to `Accepted`.
    - Use Yes/No buttons when `request_user_input` is available.
    - `Yes`: update status in ADR and ADL.
    - `No`: leave `Proposed`.
11. Ask whether to proceed with creating a CHANGE.
    - Use Yes/No buttons when `request_user_input` is available.
    - `Yes`: use `Backtrail | Create CHANGE` skill.
    - `No`: skip to the next step.
12. Stop after docs/status changes. Do not implement code.

## Question UX

- When asking the user to choose between two or three meaningful options, use `request_user_input` when available.
- For yes/no decisions, present `Yes` and `No` choices.
- If `request_user_input` is unavailable, ask one concise plain-text question with numbered choices.
- Do not claim that a skill can switch modes or force button rendering.

## Guardrails

- Do not change implementation code, templates outside this ADR artifact, configs, or tests.
- Do not overwrite existing ADR files.
- Do not create CHANGE records; use the Backtrail Create CHANGE skill for implementation plans.
- Do not treat numbers in input body as ADR numbers.
- Superseding another ADR requires explicit user confirmation.
