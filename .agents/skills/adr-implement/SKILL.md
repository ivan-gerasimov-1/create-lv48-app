---
name: ADR Implement
description: Implement a specified or first Accepted ADR after confirmation
---

## Workflow

1. Read `docs/ADL.md`.
2. Select ADR:
   - If input starts with `ADR-013`, `ADR 013`, `#13`, `#013`, `013`, or `13`, use that number.
   - Normalize to three digits: `#13` -> `ADR-013`.
   - Ignore numbers outside the input start.
   - Otherwise select the lowest-numbered `Accepted` ADR from `docs/ADL.md`.
3. Stop unless selected ADR status is `Accepted`.
4. Read the ADR and linked implementation plan; stop if plan is missing.
5. Summarize decision, scope, steps, verification, and rollback.
6. Wait for user confirmation.
7. Implement the plan and run its verification.
8. If verification passes, update status to `Implemented` in the ADR, `docs/ADL.md`, and plan when it has a status field.
9. If verification fails, leave status unchanged and report failures.

## Guardrails

- Do not infer missing implementation plans.
- If implementation needs to change the ADR decision, stop and ask for a new or updated ADR.
