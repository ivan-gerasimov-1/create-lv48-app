---
name: Backtrail | Create
description: Route Backtrail creation requests to ADR, FEATURE, or CHANGE creation
---

## Purpose

Choose the correct Backtrail creation skill. Do not create or edit Backtrail artifacts directly.

## Input

Use the text after this skill invocation as the routing brief.

## Prerequisites

- Read `.backtrail/adl.md`, `.backtrail/changes.md`, and `.backtrail/features.md` before routing, when they exist.
- Use indexes to identify referenced records, current direction, and artifact fit.
- If an index is missing, route from the brief; the selected skill handles setup.

## Workflow

1. Check prerequisites.
2. Durable decision -> `Backtrail | Create ADR`.
   - Architecture, repository structure, public contracts, generated output, build/test workflow, dependencies, reversibility, or future-work constraints.
3. User-visible capability/product behavior -> `Backtrail | Create FEATURE`.
   - User workflows, acceptance criteria, product behavior, or durable capability specs.
4. Concrete implementation work -> `Backtrail | Create CHANGE`.
   - Bug fixes, local refactors, tests, existing ADR/FEATURE implementation details, copy changes, dependency patch updates, or task-scoped plans.
5. If multiple skills match, ask one clarifying question before routing.
6. If none match, state that no matching Backtrail creation skill exists, then stop.

## Question UX

- Use `request_user_input` when available for two or three meaningful choices.
- For routing ambiguity, present only the matching artifact types as choices: `ADR`, `FEATURE`, and/or `CHANGE`.
- If `request_user_input` is unavailable, ask one concise plain-text question with numbered choices.
- Do not claim that a skill can switch modes or force button rendering.

## Guardrails

- Do not create ADR, FEATURE, CHANGE, index, config, code, or test files.
- Do not invent new Backtrail artifact types.
- Do not route to implementation work.
- Do not inspect the broader repository unless needed to classify the request.
- Preserve the original brief when handing it off to the selected skill.
