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

## Frontend

### Stack

React, TanStack Router, TanStack Query, Convex (@convex-dev/react-query), shadcn/ui, TailwindCSS, react-hook-form, zod

### Guardrails

#### Common

- On the client, avoid relying on internal underscore-prefixed fields (`_id`, etc.) in business logic.
- No route wrappers: route component must be a /modules/*/views/*View (e.g. SignUpView). Route files contain only wiring/guards; use router/location hooks inside \*View when needed.
- Shared module constants (route prefixes, default paths, URL bases, etc.) must use `SCREAMING_SNAKE_CASE` and live in a dedicated `constants.ts` module for reuse instead of duplicating string literals across files.
- Do not duplicate generic object guards/helpers (`isRecord`, etc.); prefer shared reusable helper from `src/lib/*`.
- After adding/renaming TanStack Router route files, regenerate route types (`src/routes/-routeTree.gen.ts`) before running lint/build/test.
- TanStack Router plugin scans `src/routes/*` and can treat `*.test.tsx` as route files. For route tests in that folder, prefer `-` prefix naming (for example `-index.test.tsx`) or configure ignore pattern to avoid warning noise in `test`/`build`.
- For UI network async flows (HTTP/Convex requests), always use TanStack Query
- For TanStack Query mutation hooks, accept external `onSuccess` / `onError` via hook options (e.g. `useSignIn`).
- For TanStack Query query hooks, do not add custom `onSuccess` / `onError` options; prefer returning query state directly.
- For data loading, prefer `useSuspenseQuery`.
- Do not set `retry` per-hook by default; configure retry strategy at QueryClient level.
- For Suspense query hooks, keep required params explicit (avoid nullable params + `enabled` branching inside the hook by default).
- Encapsulate feature-specific TanStack Query logic in dedicated hooks (e.g. `useSignIn`) and consume them from UI components.
- Place feature/business-specific client integrations inside feature modules; keep shared `src/lib/*` as thin reusable primitives or re-exports.
- Prefer destructuring TanStack Query hook results (e.g. `const { mutate: signIn, isPending } = useSignIn(...)`) instead of accessing mutation object fields inline.
- Use Convex adapter for TanStack Query when working with server data
- In form submit handlers, prefer `mutation.mutate(...)` when the result is not awaited in-place; use `mutateAsync(...)` only when you truly need to await the Promise.
- Prefer Suspense-style queries when it improves UX and simplifies code
- Avoid Suspense when you need partial rendering, fine-grained local states, or strictly local error UI
- Do not inject platform/native globals (Browser/JS runtime APIs like fetch, URL, localStorage, etc.) just for tests. Use them directly and mock/stub at test boundary when needed.
- Do not extract UI text/messages into constants by default; keep copy inline unless there is a clear reuse/localization need.
- For temporary/mock async UI handlers, always add delay to make loading state visible.
- For form-level submit errors, prefer `react-hook-form` root errors (`setError('root', ...)`) over separate local `useState`.
- Simple UI components belong in `src/components/ui`. Compound Component pattern is allowed there.
- For ordinary components, keep one file = one component.
- Page markup should be built using flex and grid layouts.
- In React components, destructure `props` in function parameters by default.
- Colocate props type declarations with implementation.
