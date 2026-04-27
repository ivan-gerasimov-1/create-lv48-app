---
name: Backtrail | Implement
description: Implement a CHANGE record after user confirmation
---

## Purpose

Implement an existing CHANGE record after confirming selected work with the user.

## Input

Use the text after this skill invocation to select the CHANGE record.

## Workflow

1. Read `.backtrail/changes.md`, `.backtrail/adl.md`, and `.backtrail/features.md` when they exist.
2. Select work.
   - If input starts with `CHANGE-00014`, `CHANGE 00014`, `C-00014`, `#14`, `#014`, `014`, or `14`, prefer the matching CHANGE record when it exists.
   - Otherwise, list eligible CHANGE records: status neither `Done` nor `Abandoned`.
   - If no eligible CHANGE records exist, stop and report that no implementable CHANGE exists.
   - If exactly one eligible CHANGE record exists, select it automatically.
   - If two or more eligible CHANGE records exist, ask the user to choose one. Use `request_user_input` when available.
3. Stop unless the selected CHANGE exists.
4. If the selected CHANGE links ADRs, stop unless every linked ADR exists and has status `Accepted`.
5. If the selected CHANGE links FEATUREs, stop unless every linked FEATURE exists and has status `Accepted`.
6. Read the selected CHANGE and linked ADRs or FEATUREs, if any.
7. Summarize decision context, change scope, implementation steps, verification, and rollback. For standalone CHANGE records, state that no ADR or FEATURE gate applies.
8. Ask whether to implement the selected CHANGE now.
   - Use Yes/No buttons when `request_user_input` is available.
   - `Yes`: continue to implementation.
   - `No`: stop without changing files.
9. Implement the CHANGE and run its verification.
10. If verification passes, update the CHANGE file and `.backtrail/changes.md` status to `Done`.
11. If verification passes and the CHANGE implements linked FEATUREs, update those FEATURE files and `.backtrail/features.md` status to `Implemented`.
12. If verification fails, leave status unchanged and report failures.

## Question UX

- Use `request_user_input` when available for two or three meaningful choices.
- For yes/no decisions, present `Yes` and `No` choices.
- If `request_user_input` is unavailable, ask one concise plain-text question with numbered choices.
- Do not claim that a skill can switch modes or force button rendering.

## Guardrails

- Do not infer missing CHANGE records.
- If implementation needs to change an ADR decision, stop and ask for a new or updated ADR.
- If implementation needs to change a FEATURE scope, acceptance criteria, or status gate, stop and ask for a new or updated FEATURE.
- If implementation needs a different scope than the CHANGE describes, stop and ask whether to update the CHANGE first.
