# CHANGE-025: Use default dist CLI build output

| Status | Date       | ADRs                                                             |
| ------ | ---------- | ---------------------------------------------------------------- |
| Done   | 2026-04-25 | [ADR-020](./adrs/adr-00020-use-default-dist-cli-build-output.md) |

## Goal

Implement [ADR-020](./adrs/adr-00020-use-default-dist-cli-build-output.md) by moving the published CLI executable contract from the custom `bin/create-lv48-app.js` build output to the default `dist/main.js` output from `src/main.ts`.

## Scope

Included:

- Update tsdown configuration so `src/main.ts` emits `dist/main.js` without custom output directory or filename settings.
- Update package metadata so the npm `bin` field points at `./dist/main.js`.
- Update package publish files so `dist/main.js` and `templates/` are included.
- Update package lock metadata and local start scripts that still target `bin/create-lv48-app.js`.
- Update current documentation references that describe the active executable path or verification commands.
- Remove obsolete generated `bin` output files if they are no longer part of the package contract.

Excluded:

- Adding public library entry fields such as `exports`, `main`, or `types`.
- Changing CLI behavior, prompt flow, template generation, or post-setup behavior.
- Changing historical ADR or CHANGE content except where a current status/link needs correction.

## Implementation

1. Update `tsdown.config.ts`:
   - keep `src/main.ts` as the executable entrypoint
   - remove custom `outDir`
   - remove custom entry output name if present
   - keep Node platform, ESM package behavior, minification, and sourcemap settings unless verification shows they conflict with ADR-020
2. Update `package.json`:
   - set `bin` to `./dist/main.js`
   - include `dist` and `templates` in `files`
   - update `start:dev` and `start:prod` to run `dist/main.js`
3. Update `package-lock.json` so package metadata matches `package.json`.
4. Remove tracked or generated `bin/create-lv48-app.js` artifacts if they are no longer required.
5. Update current docs and package verification notes that still point at `bin/create-lv48-app.js`.
6. Keep all runtime source imports and CLI behavior unchanged.

## Verification

Run:

```bash
npm run test
npm run build -- --publint
head -n 1 dist/main.js
node dist/main.js --help
npm pack --dry-run
```

Expected result:

- Tests pass.
- Build and publint pass.
- Build emits `dist/main.js`.
- `dist/main.js` starts with `#!/usr/bin/env node`.
- CLI smoke command exits cleanly or reaches the existing interactive prompt behavior without module resolution errors.
- Package dry run includes `dist/main.js` and `templates/`.
- Package dry run no longer relies on `bin/create-lv48-app.js`.

## Rollback

Restore the ADR-019 package shape: set `bin` back to `bin/create-lv48-app.js`, restore custom tsdown output to `bin/create-lv48-app.js`, restore package `files` and scripts that target the `bin` path, regenerate package lock metadata, and restore any removed generated `bin` artifacts if they remain part of the release workflow.
