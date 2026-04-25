# CHANGE-019: Use package import aliases for project source

| Status   | Date       | ADRs                                                                              |
| -------- | ---------- | --------------------------------------------------------------------------------- |
| Proposed | 2026-04-25 | [ADR-017](../adrs/adr-00017-use-package-import-aliases-for-project-source.md) |

## Goal

Adopt the private `#/...` package import alias from ADR-017 for project-owned TypeScript source so cross-module imports no longer depend on parent-directory relative paths, including single-level `../` imports.

## Scope

Update package and TypeScript configuration needed for private package imports, then rewrite project source imports that cross module roots.

Include:

- `package.json` Node engine floor and private `"imports"` contract.
- TypeScript resolution compatibility for package imports.
- Cross-directory imports in `src/**/*.ts`, `tests/**/*.ts`, and `templates/base/template.ts` that currently climb through parent directories, including `../` and deeper parent paths.
- Verification for typecheck, build, and tests.

Exclude:

- Generated template application source under `templates/base/files/**`; app-local `@/...` aliases stay unchanged.
- Same-directory and close sibling imports where relative paths remain clearer.
- Public package `"exports"` changes or new barrel-style `index` modules.

## Implementation

1. Raise `package.json` `engines.node` and `devEngines.runtime.version` from `>=24` to `>=24.14`.
2. Add a private package `"imports"` mapping that resolves project source, template definitions, and tests through TypeScript source files:

   ```json
   {
     "#/*": "./src/*.ts",
     "#/templates/*": "./templates/*.ts",
     "#/tests/*": "./tests/*.ts"
   }
   ```
3. Keep `tsconfig.json` on `moduleResolution: "bundler"` and do not disable package import resolution.
4. Rewrite parent-directory imports across package source to `#/...` when they cross module roots, including imports between `src`, `tests`, and `templates/base/template.ts`.
5. Keep generated app aliases and nearby relative imports unchanged.
6. Run verification and adjust only the minimum config/import surface required for the alias contract to work.

## Verification

Run:

```bash
npm run build:typecheck
npm run build
npm run test
```

Expected result:

- TypeScript resolves `#/...` imports through the package import contract.
- Build output still compiles and can resolve runtime imports.
- Test suite passes with alias imports.

## Rollback

Rewrite `#/...` imports back to relative paths, remove the private `"imports"` mapping, restore the Node engine floor to `>=24`, and rerun typecheck, build, and tests.
