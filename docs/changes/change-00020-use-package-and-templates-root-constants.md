# CHANGE-020: Use package and templates root constants

| Status | Date       | ADRs |
| ------ | ---------- | ---- |
| Done   | 2026-04-25 | -    |

## Goal

Use `import.meta.dirname` as the package-root anchor and introduce a shared `TEMPLATES_ROOT` constant so template path construction does not repeat the package-root plus `templates` segment inline.

## Scope

Included:

- Update `src/packageRoot.ts` so `PACKAGE_ROOT` is derived from `import.meta.dirname`.
- Export `TEMPLATES_ROOT` from the same package-root module.
- Update template definition path derivation to resolve template files from `TEMPLATES_ROOT`.
- Keep existing typed template metadata and `filesRoot` behavior unchanged.
- Update focused tests that assert package-root or template `filesRoot` paths.

Excluded:

- Moving template files or changing `templates/<name>/files` layout.
- Changing template metadata shape.
- Changing package import aliases or build output structure.

## Implementation

1. Replace the `fileURLToPath(import.meta.url)` package-root calculation with `path.resolve(import.meta.dirname, "..")`.
2. Add `TEMPLATES_ROOT = path.resolve(PACKAGE_ROOT, "templates")`.
3. Change `defineTemplate()` to compute `filesRoot` from `TEMPLATES_ROOT`, `config.name`, and `"files"`.
4. Remove now-unused `node:url` imports.
5. Adjust tests to assert the same final paths through the new constant contract where useful.

## Verification

Run:

```bash
npm run test
npm run lint
```

Expected result:

- Template definition tests still resolve `templates/base/files`.
- Test and lint suites pass without import or path regressions.

## Rollback

Restore `PACKAGE_ROOT` to the previous `fileURLToPath(import.meta.url)` derivation, remove `TEMPLATES_ROOT`, and return `defineTemplate()` to resolving `path.resolve(PACKAGE_ROOT, "templates", config.name, "files")`.
