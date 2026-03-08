# AI development context

The role of this file is to describe common mistakes and confusion points that agents might encounter as they work in this project. If you ever encounter something in the project that surprises you, please alert the developer working with you and indicate that this is the case in the AGENTS.md file to help prevent future agents from having the same issue. If the developer corrected something in the code style (or similar), ensure to write it down here.

## General guardrails

- Avoid editing automatically generated files

### Project structure

- monorepo
  - Applications in apps/\*
  - Utilities and helpers in packages/\*

### Dependency Management

- Install dependencies using --save-exact to ensure deterministic builds.

### Naming conventions

- Name files and directories using camelCase.

### OpenSpec

- At the end of each implementation stage, run relevant tests and build for the affected app/module before handoff.
- When OpenSpec verification identifies follow-up fixes, always append a new numbered section to the change `tasks.md` (e.g. `## N. Verification Fixes`) and track those fixes there as checkboxes.
- In restricted-network environments, `openspec` commands can print PostHog `ENOTFOUND edge.openspec.dev` flush errors even when the command itself succeeds. Treat this as non-blocking and non-reportable unless the primary command exits non-zero.
- Avoid ambiguous reversibility wording like "rollback without migrations" when schema changes are planned; specify reversible/additive schema changes and explicitly state that destructive backfill is out of scope.
- For any `openspec-*` workflow, also apply `teammate-*` guardrails based on the actual task type.

### Skill switching pitfall

- If user intent changes between turns, re-evaluate and switch to the matching skill before taking action

## Code style guardrails

### Common

- In a module/file, prefer declaration order: types first, then constants, then the main exported function, then helper functions.
- Prefer function declarations (`function name() {}`) over function expressions/arrow functions for named functions.
- Prefer simple step-by-step expressions over dense nested conditionals/ternaries.
- When handling object-shaped API responses, prefer early destructuring (`{ data, error }`) and concise domain names for locals.
- Keep type declarations in a neighboring `types.ts` file instead of colocating them with implementation.
  - Exception: for local component/function `props`, `options` and `params` types, colocating next to implementation is allowed.
- Keep module boundaries aligned with bounded contexts: if logic grows into a distinct domain, move it to its own feature module instead of colocating under an unrelated module.
- Name feature module directories as plural domain nouns by default; deviate only when singular naming is intentionally justified by the domain language. For the dashboard main screen feature, keep the canonical module path as `modules/home`.
- Do not introduce dependency injection without a real boundary or multiple implementations

### Types

- Do not use any.
- Do not use type assertions (as).
- Do not use `@ts-ignore` or `@ts-expect-error`.
- Prefer inferred function return types;
  - Avoid explicit return type annotations unless there is a clear need (public API contract, overload, or inference issue).
- Prefer explicit domain types over unknown; use unknown only at safe boundaries.

### Testing

- All new functionality must be covered by unit tests.
- Tests should validate behavior, not implementation details.
