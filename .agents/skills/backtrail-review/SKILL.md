---
name: backtrail-review
description: Review implementation for a CHANGE, including architectural/code review and validation against linked ADRs and FEATUREs
---

## Purpose

Review an implementation for a selected CHANGE record. Validate that the code satisfies the CHANGE scope, linked ADR decisions, linked FEATURE acceptance criteria, project conventions, and verification expectations.

This skill reviews only. It must not implement fixes or update Backtrail statuses.

## Input

Use the text after this skill invocation to select the CHANGE record.

## Review Scope

- CHANGE implementation scope and stated verification
- Linked ADR decisions and constraints
- Linked FEATURE behavior and acceptance criteria
- Architectural fit and module boundaries
- Code correctness, edge cases, typing, tests, and maintainability
- Project guardrails from `AGENTS.md` and `docs/engineering-conventions.md`

## Workflow

2. Read `.backtrail/changes.md`, `.backtrail/adl.md`, and `.backtrail/features.md` when they exist.
3. Select the CHANGE.
   - If input starts with `CHANGE-00014`, `CHANGE 00014`, `C-00014`, `#14`, `#014`, `014`, or `14`, prefer the matching CHANGE record when it exists.
   - Otherwise, list CHANGE records with status `Proposed`, `Blocked`, or `Done`.
   - If no CHANGE records exist, stop and report that no reviewable CHANGE exists.
   - If exactly one candidate exists, select it automatically.
   - If two or more candidates exist, ask the user to choose one. Use `request_user_input` when available.
4. Stop unless the selected CHANGE file exists.
5. Read the selected CHANGE file fully.
6. Read every linked ADR and FEATURE.
   - If there are no linked ADR or FEATURE proceed without them.
   - If a linked ADR status is not `Accepted`, mark the gate mismatch as `Must Fix` unless the CHANGE explicitly documents why the link is historical or non-gating.
   - If a linked FEATURE status is not `Accepted` or `Implemented`, mark the gate mismatch as `Must Fix` unless the CHANGE explicitly documents why the link is historical or non-gating.
7. Inspect implementation evidence.
   - Run `git status --short`.
   - Run `git diff --stat` and `git diff` for unstaged/staged changes when available.
   - If no working-tree diff exists, inspect files referenced by the CHANGE and any recent commits only if needed.
   - Do not assume implementation is complete from CHANGE status alone.
8. Map requirements to implementation.
   - Extract required behavior/scope from the CHANGE.
   - Extract architectural constraints from linked ADRs.
   - Extract acceptance criteria from linked FEATUREs.
   - For each requirement, record `Satisfied`, `Partial`, `Missing`, or `Unclear` with file references when possible.
9. Review code like a senior engineer.
   - Prioritize correctness, invariants, edge cases, tests, security, data safety, and maintainability.
   - Check module boundaries, dependency direction, public contracts, naming, generated-file guardrails, and reversibility.
   - Check TypeScript guardrails: no `any`, no type assertions except allowed `as const`, no ignored errors, explicit class visibility.
   - Check tests validate behavior, not implementation details.
10. Run verification only when safe and practical.
    - Prefer verification commands named by the CHANGE.
    - If absent, use project-standard test/typecheck/lint commands after inspecting package scripts.
    - Do not run destructive, migration, deploy, or external-service commands without explicit user confirmation.
11. Produce review findings. Do not edit files.

## Output Format

Always begin with:

`Using backtrail-review skill`

Then use this structure:

- Summary
  - Overall verdict: `Pass`, `Pass with concerns`, or `Fail`
  - One to three sentences explaining highest-impact result
- Traceability
  - CHANGE requirements: list each as `Satisfied`, `Partial`, `Missing`, or `Unclear`
  - ADR validation: list each linked ADR and whether implementation complies
  - FEATURE validation: list each linked FEATURE and whether acceptance criteria are met
- Verification
  - Commands run and results
  - Commands not run and reason
- Must Fix
  - Bugs, missing required behavior, ADR/FEATURE mismatches, missing tests, unsafe typing, broken gates, project guardrail violations
- Should Fix
  - Maintainability issues, leaky abstractions, risky patterns, unclear boundaries, weak tests
- Optional
  - Low-risk clarity improvements
- Next Step
  - Concrete recommended action: fix listed issues, accept implementation, create follow-up CHANGE, or update Backtrail artifact when scope changed

For each finding include:

- Severity section (`Must Fix`, `Should Fix`, or `Optional`)
- File path and line or symbol when possible
- Problem
- Risk
- Suggested correction

## Verdict Rules

- `Fail` when any Must Fix exists.
- `Pass with concerns` when no Must Fix exists but Should Fix items remain.
- `Pass` when no Must Fix or Should Fix items remain.
- If required context is missing, use `Fail` only when missing context blocks validation; otherwise use `Pass with concerns` and list `Unclear` traceability items.

## Question UX

- Use `request_user_input` when available for choosing among multiple CHANGE records.
- For yes/no decisions, present `Yes` and `No` choices.
- If `request_user_input` is unavailable, ask one concise plain-text question with numbered choices.
- Do not claim that a skill can switch modes or force button rendering.

## Guardrails

- Do not change implementation code, docs, statuses, configs, tests, or generated files.
- Do not mark CHANGE, ADR, or FEATURE records as done/implemented/accepted/rejected.
- Do not infer missing Backtrail records.
- Do not approve scope drift. If implementation changes CHANGE scope, FEATURE criteria, or ADR decisions, require an updated Backtrail artifact before approval.
- Do not request large rewrites unless the current shape creates concrete correctness, boundary, or maintenance risk.
- Prefer minimal, actionable fixes over broad redesign.
