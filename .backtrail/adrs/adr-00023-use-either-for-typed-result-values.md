# ADR-00023: Use Either For Typed Result Values

| Status   | Date       |
| -------- | ---------- |
| Proposed | 2026-04-26 |

## Context

Validation currently returns custom discriminated union objects through `TValidationSuccess`, `TValidationFailure`, and `TValidationResult`. That shape is useful, but each producer can build result objects by hand, which spreads construction details and makes later result handling harder to standardize.

The project needs a small, explicit result primitive before expanding this pattern beyond current validation helpers.

## Decision

Introduce a project-owned `Either` container for typed success and failure values. `Either` should preserve the existing validation result semantics while centralizing construction behind readable static methods for result and error values.

Validation result types should be based on `Either`, and validation helpers should construct results through `Either` instead of returning custom object literals.

## Consequences

Positive:

- Result construction becomes consistent and easier to audit.
- Existing validation result behavior can stay compatible while gaining a named primitive.
- Future typed success/failure flows have a clear local pattern to reuse.

Negative:

- Adds a shared abstraction that can be overused for flows where plain values or exceptions are clearer.
- Naming and API shape become part of the project contract once adopted by multiple modules.

## Alternatives Considered

- Keep custom validation result objects: simplest for current code, but keeps construction duplicated and does not create a reusable result primitive.
- Adopt a third-party functional library: richer API, but too much dependency surface for current needs.
- Use exceptions for validation failure: familiar control flow for errors, but less explicit for expected prompt validation outcomes.

## Reversibility

Supersede this ADR and migrate consumers back to local discriminated unions or another result primitive. As long as `TValidationResult` remains structurally compatible during migration, call sites can move incrementally.
