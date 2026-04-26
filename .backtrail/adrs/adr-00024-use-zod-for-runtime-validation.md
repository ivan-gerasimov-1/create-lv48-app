# ADR-00024: Use Zod for Runtime Validation in create-lv48-app

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-04-26 |

## Context

create-lv48-app currently has hand-written validation for runtime inputs. The current implementation work needs validation that is explicit, reusable, and easy to test.

Adding a validation library is a dependency decision, not only a local implementation detail. It affects future validation code, dependency maintenance, generated bundle size, and how validation errors are shaped.

## Decision

Use Zod for runtime schema validation where create-lv48-app code must validate unknown or user-provided input.

New validation logic should prefer Zod schemas over custom predicate chains when the input has object shape, multiple fields, cross-field constraints, or needs structured validation errors.

Keep simple local checks acceptable when introducing a Zod schema would add noise without improving clarity.

## Consequences

Positive:

- Validation contracts become explicit schemas instead of scattered custom checks.
- Tests can exercise schema behavior through stable success and failure paths.
- Future validation code can share one dependency and error model.

Negative:

- Project gains a runtime dependency that must be pinned and maintained.
- Small validation cases may be more verbose if Zod is used where simple checks would be clearer.
- Error formatting needs project-owned mapping so user-facing messages do not leak library internals.

## Alternatives Considered

- Keep custom validation: avoids a dependency, but keeps validation behavior spread across local helper code and makes complex input checks harder to compose.
- Use TypeScript types only: useful at compile time, but does not validate runtime input.
- Use another schema library: possible, but Zod is widely used, TypeScript-first, and adequate for current runtime validation needs.

## Reversibility

This decision can be superseded by another ADR if Zod becomes a poor fit. Rollback requires replacing Zod schemas with custom validation or another library, removing the dependency when no code uses it, and preserving current user-facing validation messages.

## Related Decisions

- [ADR-023](./adr-00023-use-either-for-typed-result-values.md)
