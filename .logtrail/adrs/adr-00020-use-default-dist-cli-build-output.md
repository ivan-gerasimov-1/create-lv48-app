# ADR-020: Use default dist CLI build output

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-04-25 |

## Context

[ADR-019](./adr-00019-build-cli-entrypoint-to-bin.md) moved the generated CLI executable to `bin/create-lv48-app.js` so the npm `bin` target and generated output were the same file. That made the command contract direct, but it also made `bin/` a generated output directory and required custom build output configuration for both directory and filename.

The current source entrypoint is `src/main.ts`. With tsdown defaults, that entrypoint naturally emits `dist/main.js`. The package can point the public npm executable at that generated file without keeping a custom output directory or a custom output filename.

The package remains CLI-only. This decision does not add public library entry fields such as `exports`, `main`, or `types`.

## Decision

Use default `dist` build output for the CLI executable.

Keep `src/main.ts` as the source-owned CLI executable entrypoint. Configure the build with as little custom output shape as practical, so the entrypoint emits `dist/main.js` through the normal build output directory and entry-derived filename.

Set the npm `bin` field to point at the built executable:

```json
{
  "bin": "./dist/main.js"
}
```

Preserve the shebang from `src/main.ts` in `dist/main.js`:

```js
#!/usr/bin/env node
```

Keep the package CLI-only. Do not add `exports`, `main`, or `types` as part of this packaging shape.

This decision supersedes [ADR-019](./adr-00019-build-cli-entrypoint-to-bin.md) once accepted.

## Consequences

Positive:

- Build output uses the conventional `dist` directory instead of treating `bin` as generated output.
- The output filename follows the source entrypoint name, reducing custom build configuration.
- The npm executable still points directly at the generated CLI file.
- The package shape remains easy to validate with package dry runs and publish checks.

Negative:

- The public npm `bin` path changes from `bin/create-lv48-app.js` to `./dist/main.js`.
- Documentation, scripts, and package-lock metadata that reference the old bin path need updates.
- Package validation must confirm `dist/main.js` is present, executable as a CLI entrypoint, and published with the template assets.

## Alternatives Considered

- Keep ADR-019 and continue building directly to `bin/create-lv48-app.js`: keeps the old npm bin path stable, but preserves custom output directory and filename configuration.
- Restore a source-controlled `bin/create-lv48-app.js` wrapper importing `dist/main.js`: keeps a traditional `bin` path, but reintroduces a second runtime file and import hop.
- Build to `dist/create-lv48-app.js`: keeps output under `dist`, but still requires a custom output filename instead of using the entry-derived default.

## Reversibility

Rollback by restoring the ADR-019 package shape: point `bin.create-lv48-app` back to `bin/create-lv48-app.js`, configure the build to emit that file, update scripts and docs that target `dist/main.js`, and restore package validation expectations for the `bin` output path.

If only the source entrypoint name changes later, supersede this decision or amend it with the new default `dist/<entry>.js` target.

## Related Decisions

- [ADR-004](./adr-00004-use-tsdown-for-cli-builds.md)
- [ADR-005](./adr-00005-validate-package-before-publish.md)
- [ADR-019](./adr-00019-build-cli-entrypoint-to-bin.md)
