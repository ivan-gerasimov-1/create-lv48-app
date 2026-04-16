---
name: ADR Prepare
description: Create a new ADR from user-provided plan/description
---

1. Use user input as a starting point
2. Create ADR (see @docs/adrs) for requested feature
3. Find next ADR number: read `docs/ADL.md` decisions table, use max ADR-NNN + 1
4. Create directory `docs/adrs/adr-NNN/`
5. Create `ADR-NNN.md` from template with status `Proposed` and current date
6. Create `ADR-NNN_IMPLEMENTATION-PLAN.md` if implementation steps are described
7. Add entry to `docs/ADL.md` decisions table
8. Confirm with user before finalizing
9. Update status from `Proposed` to `Accepted` in `ADR-NNN.md`, `ADR-NNN_IMPLEMENTATION-PLAN.md`, and `docs/ADL.md`
10. propose a git branch name in the following format: adr-NNN-{{title from ADR}}
11. Stop after docs changes, do not proceed to code changes
