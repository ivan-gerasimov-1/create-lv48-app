# ADR-015: Use class-based post-setup orchestration

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-04-16 |

## Context

Project conventions prefer named functions by default, and `postSetup.ts` currently follows that style.

The post-setup module now combines action ordering, optional action status handling, action-specific command execution, git compatibility fallback, and process spawning in one procedural file. That remains workable for two actions, but it makes future post-setup actions more likely to add branching and helper functions to the same module instead of giving each action clear ownership.

The decision should stay narrow because broad class usage across CLI modules would conflict with current style preferences and create unrelated churn.

## Decision

Use class-based orchestration for `src/cli/postSetup.ts`.

`PostSetupExecutor` owns post-setup action ordering and runs the configured actions.

Each post-setup action is represented by its own class. Initial action classes cover dependency installation and git repository initialization.

Post-setup action classes share a common action contract for:

- action name
- command detail
- user-facing progress message
- selected, skipped, completed, and failed status creation

Keep the public CLI contract stable:

- keep `TPostSetupExecutor.run(...)` behavior and result shape
- keep `createPostSetupExecutor(commandExecutor)` as the compatibility factory
- keep `executeCommand(...)` as the command execution adapter

Do not change generated output, prompt behavior, summary behavior, command behavior, or failure semantics as part of this decision.

## Consequences

Positive:

- Post-setup action ownership becomes clearer as more actions are added.
- Shared status handling is kept in one contract instead of repeated per action.
- Current CLI composition and tests can remain stable.
- The decision is local to post-setup and avoids a broad class-vs-function rule.

Negative:

- This creates a local exception to the default function-preferred style.
- Small action classes add some ceremony while only two actions exist.
- Tests must continue to assert behavior instead of class internals.

## Alternatives Considered

- Keep the function-based module: lower ceremony and aligns with current style, but continued growth would keep action orchestration and action-specific behavior mixed together.
- Introduce classes across CLI subsystems: consistent object-oriented structure, but too broad for the current need and likely to cause unrelated refactors.
- Split function-based actions into separate helper functions only: smaller change, but does not establish a durable extension model for post-setup actions.

## Reversibility

This decision can be superseded if class-based post-setup orchestration creates more ceremony than clarity.

Rollback by replacing action classes with function-based action helpers while keeping the existing `createPostSetupExecutor(commandExecutor)` factory, `TPostSetupExecutor.run(...)` contract, result shape, and post-setup tests intact.
