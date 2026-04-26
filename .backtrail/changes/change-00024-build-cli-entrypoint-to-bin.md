# CHANGE-024: Build CLI entrypoint to bin

| Status | Date       | ADRs                                                       |
| ------ | ---------- | ---------------------------------------------------------- |
| Done   | 2026-04-25 | [ADR-019](./adrs/adr-00019-build-cli-entrypoint-to-bin.md) |

## Goal

Implement [ADR-019](./adrs/adr-00019-build-cli-entrypoint-to-bin.md) by making `src/main.ts` the source-owned CLI executable entrypoint and building the published command directly to `bin/create-lv48-app.js`.

## Scope

Included:

- Add `src/main.ts` as the CLI executable entrypoint.
- Keep the `#!/usr/bin/env node` shebang in `src/main.ts`.
- Configure the build to bundle executable code into `bin/create-lv48-app.js`.
- Preserve the existing public npm `bin` path.
- Keep `templates/` in its current repository location.
- Update package scripts, package fields, and project docs that still assume `dist/cli.js` is the built runtime entrypoint.
- Add or update tests for the executable entrypoint and package/build contract where useful.

Excluded:

- Moving `templates/`.
- Bundling template file contents into the executable.
- Changing prompt, scaffold, transform, or post-setup behavior.
- Adding public library entry fields such as `exports`, `main`, or `types`.

## Implementation

1. Move the executable wrapper behavior into `src/main.ts`:
   - include `#!/usr/bin/env node`
   - import `runCli`
   - keep the existing error handling and `process.exitCode` behavior
2. Keep `runCli` in project source as callable code for tests and internal reuse.
3. Update `tsdown.config.ts`:
   - entry points to `src/main.ts`
   - output emits `bin/create-lv48-app.js`
   - bundled executable output remains one JavaScript file
   - shebang is preserved in output
   - template asset handling keeps `templates/` in place for the packaged CLI
4. Update `package.json` scripts and package file list as needed so:
   - `bin.create-lv48-app` still points at `bin/create-lv48-app.js`
   - local production start runs the built bin file
   - development flow remains usable without treating generated `bin/create-lv48-app.js` as source
5. Update references in docs and Logtrail records that describe current build output as `dist/cli.js`, except historical context where describing past state is useful.
6. Keep generated output out of hand-authored source review unless the repository intentionally tracks the built bin file.
7. Update this CHANGE status in `.backtrail/changes.md` after implementation and verification.

## Verification

Run:

```bash
npm run build:typecheck
npm run build
npm run test
head -n 1 bin/create-lv48-app.js
node bin/create-lv48-app.js --help
npm pack --dry-run
```

Expected result:

- TypeScript production typecheck passes.
- Build emits `bin/create-lv48-app.js`.
- Built bin starts with `#!/usr/bin/env node`.
- Tests pass.
- Built bin handles a basic CLI invocation without importing `dist/cli.js`.
- Package dry run includes `bin/create-lv48-app.js` and `templates/`.
- Package dry run does not require `dist/cli.js` for CLI execution.

## Rollback

Restore the source-controlled `bin/create-lv48-app.js` wrapper, point the build back at `src/cli.ts`, emit `dist/cli.js`, restore any package import alias or script references needed for `#/dist/*`, and revert package/docs updates that made `bin/create-lv48-app.js` generated build output.
