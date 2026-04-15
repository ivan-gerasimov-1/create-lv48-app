---
name: Implement ADR
description: Find first Proposed/Accepted ADR and implement it after confirmation
---

1. Search `docs/ADL.md` for ADR with status `Proposed` or `Accepted`
2. Select the first matching ADR (lowest number)
3. Read the ADR file and its linked implementation plan
4. Present the implementation plan summary to the user
5. Wait for user confirmation before proceeding
6. Execute implementation steps from the plan
7. Run verification (typically `npm run test`)
8. Update ADR status from `Proposed`/`Accepted` to `Implemented` after verification passes
