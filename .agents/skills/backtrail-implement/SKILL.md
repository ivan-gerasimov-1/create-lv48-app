---
name: Backtrail | Implement
description: Implement a CHANGE record linked to an Accepted ADR after confirmation
---

# Workflow

1. Read `.backtrail/changes.md` and `.backtrail/adl.md`.
2. Select work:
   - If input starts with `CHANGE-00014`, `CHANGE 00014`, `C-00014`, `#14`, `#014`, `014`, or `14`, prefer the matching CHANGE record when it exists.
   - Otherwise select the lowest-numbered non-`Done`, non-`Abandoned` CHANGE
3. Stop unless the selected CHANGE exists.
4. Stop unless every linked ADR exists and has status `Accepted`.
5. Read the selected CHANGE and linked ADRs.
6. Summarize decision context, change scope, implementation steps, verification, and rollback.
7. Ask whether to implement the selected CHANGE now.
   - Use Yes/No buttons when `request_user_input` is available.
   - `Yes`: continue to implementation.
   - `No`: stop without changing files.
8. Implement the CHANGE and run its verification.
9. If verification passes, update the CHANGE file and `.backtrail/changes.md` status to `Done`.
10. If verification fails, leave status unchanged and report failures.

# Question UX

- When asking the user to choose between two or three meaningful options, use `request_user_input` when available.
- For yes/no decisions, present `Yes` and `No` choices.
- If `request_user_input` is unavailable, ask one concise plain-text question with numbered choices.
- Do not claim that a skill can switch modes or force button rendering.

# Guardrails

- Do not infer missing CHANGE records.
- If implementation needs to change an ADR decision, stop and ask for a new or updated ADR.
- If implementation needs a different scope than the CHANGE describes, stop and ask whether to update the CHANGE first.
