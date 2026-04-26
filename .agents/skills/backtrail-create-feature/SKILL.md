---
name: Backtrail | Create FEATURE
description: Create a new Proposed FEATURE record for user-visible capability or product behavior
---

Use the text after this skill invocation as the feature brief.

Use this skill only to create FEATURE documentation. Inspect code as needed, but write only FEATURE docs and `.backtrail/features.md`.

## Resources

- Use `assets/feature-template.md` as the FEATURE template.

## Statuses

- Allowed statuses: `Proposed`, `Accepted`, `Rejected`, `Implemented`.
- Create step creates `Proposed` FEATURE records. `Implemented` is reserved for later implementation completion.

## Workflow

1. If the brief does not identify user-visible capability or product behavior, ask for the feature topic before creating files.
2. Read `.backtrail/features.md`, related FEATURE/ADR/CHANGE docs, and relevant code. If `.backtrail/features.md` or `.backtrail/features/` is missing, plan to create it.
3. Apply the FEATURE gate before creating files:
   - Create a FEATURE only for user-visible capability, product behavior, workflow, or acceptance criteria that benefits from a durable capability spec.
   - Route durable architecture choices to `Backtrail | Create ADR` first when the brief constrains future work, changes architecture, repository structure, public contracts, generated output, build/test workflow, dependencies, or reversibility.
   - Route concrete implementation work without feature-spec need to `Backtrail | Create CHANGE`.
   - If the gate does not pass, stop and explain which artifact is the better fit. Do not create FEATURE files.
4. Determine FEATURE number:
   - Use an explicit number only when it appears at the start of input, after optional whitespace.
   - Supported prefixes: `FEATURE-014`, `FEATURE 014`, `F-014`, `#14`, `#014`, `014`, `14`.
   - Normalize to five digits: `#14 Export runs` -> `FEATURE-00014`, `.backtrail/features/feature-00014-export-runs.md`.
   - Do not scan the input body for FEATURE numbers.
   - If no starting number exists, use max `FEATURE-NNNNN` from `.backtrail/features.md` + 1.
   - If `.backtrail/features.md` is missing, create it and start at `FEATURE-00001` unless the brief has an explicit starting number.
5. Stop if `.backtrail/features/feature-NNNNN-title-slug.md` already exists.
6. Present a rough approach before writing:
   - capability
   - users/use cases
   - scope and non-goals
   - acceptance criteria
   - dependencies
   - risks/rollback
   - related FEATUREs/ADRs, if any
7. Ask clarifying questions only when the answer changes capability, users, scope, compatibility, acceptance criteria, dependencies, or rollback.
8. Create `.backtrail/features/feature-NNNNN-title-slug.md` from `assets/feature-template.md`.
9. Save FEATURE and `.backtrail/features.md` entry with status `Proposed`.
10. Ask whether to promote to `Accepted` or `Rejected`.
    - Prefer Yes/No buttons when available.
    - `Accepted`: update status in FEATURE and feature index.
    - `Rejected`: update status in FEATURE and feature index.
    - No decision: leave `Proposed`.
11. Offer to proceed with creating a CHANGE after FEATURE creation.
    - Prefer Yes/No buttons when available.
    - `Yes`: use `Backtrail | Create CHANGE` skill.
    - `No`: skip to the next step.
12. Stop after docs/status changes. Do not implement code.

## Guardrails

- Do not change implementation code, templates outside this FEATURE artifact, configs, or tests.
- Do not overwrite existing FEATURE files.
- Do not create ADR or CHANGE records directly; use the matching Backtrail Create skill.
- Do not treat numbers in input body as FEATURE numbers.
- Do not mark FEATURE as `Implemented` during creation. Set `Implemented` later when implementation CHANGE records finish.
- Superseding or replacing another FEATURE requires explicit user confirmation.
