---
name: adr:prepare
description: Create a new ADR from user-provided plan/description
---

1. Use context from the previous user message as the decision description/plan
2. Find next ADR number: read `docs/ADL.md` decisions table, use max ADR-NNN + 1
3. Create directory `docs/adrs/adr-NNN/`
4. Create `ADR-NNN.md` from template with status `Proposed` and current date
5. Create `ADR-NNN_IMPLEMENTATION-PLAN.md` if implementation steps are described
6. Add entry to `docs/ADL.md` decisions table
7. Confirm with user before finalizing
8. Update status from `Proposed` to `Accepted` in `ADR-NNN.md`, `ADR-NNN_IMPLEMENTATION-PLAN.md`, and `docs/ADL.md`
