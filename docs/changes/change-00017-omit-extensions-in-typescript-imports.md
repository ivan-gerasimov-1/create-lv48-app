# CHANGE-017: Omit extensions in TypeScript imports

| Status   | Date       | ADRs |
| -------- | ---------- | ---- |
| Proposed | 2026-04-24 | -    |

## Goal

Remove `.js` and `.ts` suffixes from TypeScript import and export specifiers so project source follows the extensionless import style supported by the current TypeScript and bundler setup.

## Scope

Included:

- Rewrite relative imports and exports in `src/**/*.ts`, `tests/**/*.ts`, and `templates/**/*.ts` from extension-bearing specifiers to extensionless specifiers.
- Cover type-only imports, value imports, re-exports, and dynamic imports if present.
- Keep formatting changes limited to touched import/export declarations.

Excluded:

- Do not change runtime JavaScript entrypoints that need file extensions for Node ESM resolution, including `bin/create-lv48-app.js`.
- Do not change generated `dist` output or package metadata.
- Do not introduce path aliases or barrel-style `index` modules.

## Implementation

1. Search for import/export specifiers ending in `.js` or `.ts` across source, tests, and template files.
2. Rewrite matching specifiers to remove the file extension while keeping the same relative path target.
3. Leave `bin/create-lv48-app.js` unchanged because it is a checked-in JavaScript runtime entrypoint that imports built output.
4. Re-run the search and confirm no extension-bearing TypeScript import/export specifiers remain in the intended scope.

## Verification

Run:

```bash
npm run test
npm run build
rg -n "from ['\"][^'\"]+\\.(js|ts)['\"]|import\\(['\"][^'\"]+\\.(js|ts)['\"]\\)|export .* from ['\"][^'\"]+\\.(js|ts)['\"]" src tests templates
```

Expected result:

- Tests pass.
- Build and typecheck pass.
- The final search returns no matches in TypeScript source, tests, or template files.

## Rollback

Revert the import-specifier rewrite commit. If the build toolchain later requires explicit emitted extensions, restore `.js` suffixes in TypeScript import/export specifiers and rerun `npm run build`.
