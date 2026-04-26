---
name: Backtrail | Create
description: Route Backtrail creation requests to ADR, FEATURE, or CHANGE creation skill
---

Use the text after this skill invocation as the routing brief.

Use this skill only to select the proper Backtrail creation skill. Do not create or edit Backtrail artifacts directly.

## Prerequisites

- Read `.backtrail/adl.md`, `.backtrail/changes.md`, and `.backtrail/features.md` before routing when they exist.
- Use current ADR, CHANGE, and FEATURE index state to recognize referenced records, existing direction, and likely artifact fit.
- If an index is missing, continue routing from the brief and let the selected creation skill handle missing index setup.

## Workflow

1. Check prerequisites.
2. If the brief clearly describes a durable decision, use `Backtrail | Create ADR`.
   - Includes architecture, repository structure, public contracts, generated output, build/test workflow, dependencies, reversibility, or choices that constrain future work.
3. If the brief clearly describes user-visible capability or product behavior, use `Backtrail | Create FEATURE`.
   - Includes user workflows, acceptance criteria, product behavior, or durable capability specs.
4. If the brief clearly describes concrete implementation work, use `Backtrail | Create CHANGE`.
   - Includes routine bug fixes, local refactors, test additions, implementation details of an existing ADR or FEATURE, copy changes, dependency patch updates, or task-scoped implementation plans.
5. If multiple skills could match, ask one clarifying question to choose between the matching skills before routing.
6. If no skill matches, say that no matching Backtrail creation skill exists for the request and stop.

## Question UX

- When asking the user to choose between two or three meaningful options, use `request_user_input` when available.
- For routing ambiguity, present only the matching artifact types as choices: `ADR`, `FEATURE`, and/or `CHANGE`.
- If `request_user_input` is unavailable, ask one concise plain-text question with numbered choices.
- Do not claim that a skill can switch modes or force button rendering.

## Guardrails

- Do not create ADR, FEATURE, CHANGE, index, config, code, or test files directly.
- Do not invent new Backtrail artifact types.
- Do not route to implementation work.
- Do not inspect the broader repository unless needed to classify the request.
- Preserve the original brief when handing off to the selected skill.
