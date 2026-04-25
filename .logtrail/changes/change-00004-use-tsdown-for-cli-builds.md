# CHANGE-004: Use tsdown for CLI builds

| Status | Date       | ADRs                                                      |
| ------ | ---------- | --------------------------------------------------------- |
| Done   | 2026-04-15 | [ADR-004](./adrs/adr-00004-use-tsdown-for-cli-builds.md) |

## Goal

Replace TypeScript compiler emit with tsdown for CLI build output while preserving explicit type checking and adding a development watch mode.

## Scope

Implement [ADR-004](./adrs/adr-00004-use-tsdown-for-cli-builds.md).

## Implementation

1. Install exact dev dependencies:
   - `tsdown`
   - `concurrently`
2. Add `tsdown.config.ts`:
   - entry `cli` points to `src/cli.ts`
   - format is ESM
   - platform is Node
   - tsconfig is `tsconfig.build.json`
   - declarations are enabled
   - sourcemaps are disabled
   - output is cleaned before build
3. Update package scripts:
   - `build` -> `tsdown`
   - `build:typecheck` -> `tsc -p tsconfig.build.json`
   - `dev` -> `concurrently --kill-others-on-fail --names build,types "npm run build -- --watch" "npm run build:typecheck -- --watch --preserveWatchOutput"`
   - `prebuild` -> `npm run build:typecheck`
   - `start` -> `node bin/create-lv48-app.js`
4. Simplify `tsconfig.build.json` into a production typecheck config:
   - keep `extends`
   - keep `include`
   - keep `exclude`
   - keep `types`
   - set `noEmit: true`
   - remove emit-only options such as `declaration`, `outDir`, `rootDir`, and `sourceMap`
5. Keep existing package runtime fields unchanged:
   - `bin`
   - `files`
   - `type`
   - `engines`
6. Do not add public library entry fields:
   - no `exports`
   - no `main`
   - no `types`

## Verification

Run:

```bash
npm run build:typecheck
npm run build
npm run test
npm run start -- --version
npm pack --dry-run
npm run dev
```

Expected result:

- TypeScript production typecheck passes.
- Build emits `dist/cli.js`.
- Build emits `dist/cli.d.ts`.
- Tests pass.
- Start command prints the package version when passed `--version`.
- Package dry run includes `bin`, `dist/cli.js`, `dist/cli.d.ts`, and `templates`.
- Package dry run does not include `src`.
- Development mode starts tsdown watch and TypeScript watch together.

## Rollback

Remove `tsdown.config.ts`, restore `build` to `tsc -p tsconfig.build.json`, restore TypeScript emit fields in `tsconfig.build.json`, remove `build:typecheck`, `dev`, `prebuild`, and `start` if they are not otherwise needed, and remove `tsdown` and `concurrently` from dev dependencies.
