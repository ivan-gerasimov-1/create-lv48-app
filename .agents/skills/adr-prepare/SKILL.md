---
name: ADR Prepare
description: Create a new Proposed ADR and implementation plan from user-provided decision input
---

Use the text after this skill invocation as the decision brief.

Use this skill only to prepare ADR documentation. Inspect code as needed, but write only ADR docs and `docs/ADL.md`.

## Resources

- Use `assets/ADR-TEMPLATE.md` as the ADR and implementation-plan template.

## Workflow

1. If the brief does not identify a decision, ask for the decision topic before creating files.
2. Read `docs/ADL.md`, relevant ADRs/docs/code, and inspect current state.
3. Determine ADR number:
   - Use an explicit number only when it appears at the start of input, after optional whitespace.
   - Supported prefixes: `ADR-013`, `ADR 013`, `#13`, `#013`, `013`, `13`.
   - Normalize to three digits: `#13 Use Clack` -> `ADR-013`, `docs/adrs/adr-013/`.
   - Do not scan the input body for ADR numbers.
   - If no starting number exists, use max `ADR-NNN` from `docs/ADL.md` + 1.
4. Stop if `docs/adrs/adr-NNN/`, `ADR-NNN.md`, or `ADR-NNN_IMPLEMENTATION-PLAN.md` already exists.
5. Present a rough approach before writing:
   - decision
   - key rationale
   - implementation shape
   - risks/rollback
   - related ADRs, if any
6. Ask clarifying questions only when the answer changes decision, scope, compatibility, verification, or rollback.
7. Create both docs from `assets/ADR-TEMPLATE.md`:
   - `docs/adrs/adr-NNN/ADR-NNN.md`
   - `docs/adrs/adr-NNN/ADR-NNN_IMPLEMENTATION-PLAN.md`
8. Save ADR, plan, and `docs/ADL.md` entry with status `Proposed`.
9. Ask whether to promote to `Accepted`.
   - Prefer Yes/No buttons when available.
   - `Yes`: update status in ADR, plan, and ADL.
   - `No`: leave `Proposed`.
10. Propose branch name: `adr-NNN-title-slug`.
11. Stop after docs/status changes. Do not implement code.

## Guardrails

- Do not change implementation code, templates, configs, or tests.
- Do not overwrite existing ADR files.
- Do not mark ADR as `Implemented`.
- Do not treat numbers in input body as ADR numbers.
- Superseding another ADR requires explicit user confirmation.
