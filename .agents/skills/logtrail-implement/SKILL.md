---
name: Logtrail Implement
description: Implement a CHANGE record linked to an Accepted ADR after confirmation
---

## Workflow

1. Read `docs/adl.md` and `docs/changes.md`.
2. Select work:
   - If input starts with `CHANGE-014`, `CHANGE 014`, `C-014`, `#14`, `#014`, `014`, or `14`, prefer the matching CHANGE record when it exists.
   - If input starts with `ADR-014` or `ADR 014`, select that ADR and then select the lowest-numbered non-`Done`, non-`Abandoned` CHANGE linked to it.
   - Otherwise select the lowest-numbered non-`Done`, non-`Abandoned` CHANGE linked to an `Accepted` ADR.
3. Stop unless the selected CHANGE exists.
4. Stop unless every linked ADR exists and has status `Accepted`.
5. Read the selected CHANGE and linked ADRs.
6. Summarize decision context, change scope, implementation steps, verification, and rollback.
7. Wait for user confirmation.
8. Implement the CHANGE and run its verification.
9. If verification passes, update the CHANGE file and `docs/changes.md` status to `Done`.
10. If verification fails, leave status unchanged and report failures.

## Guardrails

- Do not infer missing CHANGE records.
- Do not update ADR status as part of implementation.
- If implementation needs to change an ADR decision, stop and ask for a new or updated ADR.
- If implementation needs a different scope than the CHANGE describes, stop and ask whether to update the CHANGE first.
