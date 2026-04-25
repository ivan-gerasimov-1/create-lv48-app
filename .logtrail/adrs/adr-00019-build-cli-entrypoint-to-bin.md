# ADR-019: Build CLI entrypoint to bin

| Status   | Date       |
| -------- | ---------- |
| Proposed | 2026-04-25 |

## Context

The package is a CLI-only npm initializer with this public executable:

```json
{
  "bin": {
    "create-lv48-app": "bin/create-lv48-app.js"
  }
}
```

Current build behavior, from [ADR-004](./adr-00004-use-tsdown-for-cli-builds.md), emits a bundled CLI into `dist/cli.js`. The published `bin/create-lv48-app.js` file is a small source-controlled wrapper with a shebang that imports the built file through the `#/dist/*` package import alias.

That keeps the command stable, but it makes the runtime package shape split the executable contract from the built CLI output. The project needs a clearer build contract where the npm bin target itself is generated from project source, remains executable, and does not require a second JavaScript file for the CLI runtime.

The package also has a root `templates/` directory used as scaffold input. Template assets are package data, not CLI executable code, and moving them would increase path churn without improving the executable contract.

## Decision

Build the publishable CLI executable directly to the existing npm bin path, `bin/create-lv48-app.js`.

Add a source-owned CLI executable entrypoint at `src/main.ts` for the `create-lv48-app` command. The build must use that source entrypoint as the executable input and emit the existing npm `bin` target path.

Keep the shebang in the source entrypoint and preserve it in the emitted `bin/create-lv48-app.js` file:

```js
#!/usr/bin/env node
```

Bundle executable code into one JavaScript file for the published command. Do not keep a runtime wrapper that imports `dist/cli.js` as the primary command path.

Keep `templates/` in its existing repository location. The build/package process may include or copy template assets as needed for publication, but this decision does not move the source `templates/` directory into `src` or under `bin`.

## Consequences

Positive:

- The npm `bin` target is the actual built executable.
- Published CLI startup has one fewer runtime import hop.
- Shebang handling lives with the CLI entrypoint source and remains part of the build contract.
- CLI code can still be organized under `src` while package template assets stay in their current location.

Negative:

- `bin/create-lv48-app.js` becomes generated output, so release and local workflows must avoid treating it as hand-authored source.
- Existing documentation and scripts that assume `dist/cli.js` as the built runtime entrypoint need updates, while references to the public `bin/create-lv48-app.js` path stay stable.
- Package validation must verify executable mode, shebang, and template availability after build.

## Alternatives Considered

- Keep the source-controlled `bin` wrapper importing `dist/cli.js`: stable and already implemented, but keeps generated runtime output separate from the npm executable contract.
- Build to `dist` and copy or link from `bin`: preserves a `dist` build convention, but still leaves two output locations involved in one executable contract.
- Move `templates/` into `src` so all inputs live under one tree: simpler mental model for source ownership, but creates broad path churn and mixes package data with executable source.
- Bundle template files into the executable: produces a more self-contained binary, but makes template inspection harder and increases build complexity.

## Reversibility

This decision can be superseded by restoring the source-controlled `bin/create-lv48-app.js` wrapper, rebuilding the CLI to `dist/cli.js`, restoring package import aliases or scripts that reference `#/dist/*`, and keeping `bin` as wrapper source instead of build output. If only the source entrypoint name changes, the decision can be amended or superseded by pointing the build at a different `src` file while preserving the `bin/create-lv48-app.js` output path.

Template rollback is minimal because this decision preserves the existing `templates/` directory location.

## Related Decisions

- [ADR-004](./adr-00004-use-tsdown-for-cli-builds.md)
- [ADR-005](./adr-00005-validate-package-before-publish.md)
