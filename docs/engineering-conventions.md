# Engineering Conventions

This document describes the development conventions, code style guardrails, and architectural preferences that developers and agents should follow in this project.

## Testing

- All new functionality must be covered by unit tests.
- Tests should validate behavior, not implementation details.

## Architecture and Module Boundaries

- Architecture decisions are tracked in [docs/ADL.md](./ADL.md).
- Keep module boundaries aligned with bounded contexts. If logic grows into a distinct domain, move it into its own feature module instead of keeping it under an unrelated one.
- Name feature module directories as plural domain nouns by default; deviate only when singular naming is intentionally justified by the domain language.
- Use functional filenames for project-owned modules and assets instead of `index` files. Do not add barrel-style `index` modules.

## Style Preferences

- In a module/file, prefer declaration order: types first, then constants, then the main exported function, then helper functions.
- Prefer function declarations (`function name() {}`) over function expressions (`const name = () => {}`) for named functions by default.
- Prefer simple step-by-step expressions over dense nested conditionals or ternaries.
- When handling object-shaped API responses, prefer early destructuring (`{ data, error }`) and concise domain names for locals.
- Use `let` by default for variables.
- Use `const` only for true constants.
  ```typescript
  const FOO = "bar";
  ```

## TypeScript

- Do not use `any`.
- Do not use type assertions such as `value as T`.
- `as const` is allowed for literal narrowing and enum-like constant objects.
- Do not use `@ts-ignore` or `@ts-expect-error`.
- Prefer inferred function return types.
  - Avoid explicit return type annotations unless there is a clear need (public API contract, overload, or inference issue).
- Prefer explicit domain types over `unknown`; use `unknown` only at safe boundaries.
- By default, keep shared type declarations in a neighboring `types.ts` file instead of colocating them with implementation.
  - Exception: local component/function `props`, `options`, and `params` types may stay next to the implementation.

### Naming Conventions

- Prefix interface names with `I`.
- Prefix type names with `T`.
- Prefix enum and constant object names with `E`.
- Use PascalCase for enums and constant objects.
- Use objects with `as const` + `typeof` for union types.
