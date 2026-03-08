---
name: feature-implement
description: Executes the implementation phase of a feature based on the existing SpecKit plan and task list, without revisiting requirements or planning artifacts.
---

Execute all implementation tasks based on the existing OpecSpec plan and task list.

Do not redefine requirements, revisit planning decisions, or modify planning artifacts during this phase.

Additional requirements:

- Suggest commit message for each completed implementation phase.
- After completing each implementation phase, perform a code review.
- Fix all blocking issues and concrete review findings.
- Repeat the review-and-fix cycle until no blocking issues or actionable review comments remain.
- Stop iterating once the implementation is ready to ship; do not continue refining purely subjective or non-essential feedback.
- If further review produces only minor, non-blocking suggestions, record them as follow-up improvements instead of continuing the implementation loop.

Use the following skills:

1. /openspec-apply-change

2. /openspec-verify-change
