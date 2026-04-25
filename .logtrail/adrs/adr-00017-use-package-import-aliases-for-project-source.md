# ADR-017: Use package import aliases for project source

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-04-25 |

## Context

Project source currently uses relative TypeScript imports across `src`, `tests`, and template definitions. That keeps configuration small, but deep paths such as `../../tests/createPromptIoMock` and `../../templates/base/template` make larger refactors noisier and make module ownership harder to scan.

Node supports package-private subpath imports through the `package.json` `"imports"` field. Those specifiers must start with `#`, and `#/...` specifiers are supported by Node from `24.14`. The project currently declares Node `>=24`, so adopting `#/...` requires raising the effective Node floor to `>=24.14`.

The package already uses TypeScript `moduleResolution: "bundler"`, which supports package `"imports"` resolution when `resolvePackageJsonImports` remains enabled. Generated template applications already use their own app-local `@/...` imports, so project source should avoid reusing that symbol for package internals.

## Decision

Use Node package subpath imports with a `#/...` prefix for this package's own TypeScript source imports, and make TypeScript resolve the same contract.

Rules:

- Define the alias in `package.json` `"imports"` instead of using TypeScript-only `paths` as the source of truth.
- Raise the package Node engine floor to `>=24.14` before introducing `#/*` imports.
- Keep `moduleResolution: "bundler"` and rely on TypeScript's default package `"imports"` resolution. Do not set `resolvePackageJsonImports` to `false`.
- Include TypeScript-compatible resolution for local source, for example with a `"types"` condition that points at `src/**/*.ts` and a runtime/default target that points at emitted JavaScript if runtime resolution is needed.
- Prefer `#/...` for cross-directory imports in project source when the import would otherwise climb one or more parent directories.
- Keep same-directory and close sibling imports relative when that is clearer.
- Do not use `@/...` for package internals because generated template apps already use that convention for app-local imports.
- Do not introduce barrel-style `index` modules to make alias imports shorter.
- Keep published public package exports out of the alias contract. Package `"imports"` are private to this package and must not become consumer-facing API.

## Consequences

Positive:

- Cross-module imports become easier to read and safer to move during refactors.
- The `#` prefix makes package-internal imports distinct from generated app aliases.
- The convention follows Node package subpath imports instead of tool-only aliasing.
- TypeScript, tests, and builds can share one package-level import contract.

Negative:

- Build, typecheck, and test configuration must agree on the alias.
- The Node engine declaration must be tightened before using `#/...`; otherwise Node `24.0.0` through `24.13.x` would satisfy `package.json` but not the alias syntax.
- Alias imports can hide physical distance between modules if used for nearby files.
- Rollback requires both config removal and import rewrite.

## Alternatives Considered

- Keep relative imports: lowest configuration cost, but path noise grows as module boundaries spread across `src`, `tests`, and `templates`.
- Use TypeScript `paths`: easy for typecheck, but not a Node package subpath import contract and can diverge from runtime/build resolution.
- Use `#src/*`: compatible with older Node versions that support `"imports"` but not `#/...`, but noisier than the requested root-like `#/...` form.
- Use `@/...`: familiar in Vite apps, but conflicts with generated web template convention and makes package source look like app source.
- Use package-name imports: closer to published-package style, but this package is CLI-only and does not currently expose public source subpaths.

## Reversibility

Supersede this ADR if alias imports become incompatible with the build or runtime model. Rollback by rewriting `#/...` imports back to relative paths, removing alias configuration, and running typecheck, build, and tests.

## Related Decisions

- [ADR-006: Avoid project-owned index files](./adr-00006-avoid-project-owned-index-files.md)
