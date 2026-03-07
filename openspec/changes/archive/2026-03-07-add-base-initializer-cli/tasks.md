## 1. CLI package bootstrap

- [x] 1.1 Create the `create-lv48-app` package manifest, bin entrypoint, TypeScript config, and test runner setup
- [x] 1.2 Add the initial source module skeleton for `cli`, `prompts`, `generate`, `presets`, `transforms`, and `utils`

## 2. Input and preset resolution

- [x] 2.1 Implement the answer model plus project-name, package-name, and target-directory validation
- [x] 2.2 Implement the interactive prompt flow for phase 1 defaults and optional post-setup choices without package-manager or preset prompts
- [x] 2.3 Implement the preset registry and metadata loader for the `base` preset

## 3. Scaffold generation pipeline

- [x] 3.1 Implement preflight target-directory conflict checks and write tracking for reversible generation
- [x] 3.2 Implement recursive template copy with special-file rename handling
- [x] 3.3 Implement centralized placeholder interpolation for text assets
- [x] 3.4 Implement structural JSON transforms for root and workspace package metadata

## 4. Base preset assets

- [x] 4.1 Add the `base` template tree for the npm-workspaces monorepo with `apps/web`, `apps/site`, `apps/api`, shared packages, and workspace `package.json` manifests
- [x] 4.2 Add npm-workspaces config, env examples, root README, project-level READMEs for apps and packages, and minimal starter files for `React + Vite`, `Astro`, and `Node + Hono`
- [x] 4.3 Add preset metadata that declares placeholder keys, npm support, and post-generation rules

## 5. Post-setup and verification

- [x] 5.1 Implement optional dependency installation with clear failure reporting
- [x] 5.2 Implement optional git initialization and final summary output
- [x] 5.3 Add unit tests for validation, preset resolution, transforms, and post-setup decisions
- [x] 5.4 Add a smoke test that scaffolds the `base` preset and verifies the generated tree, workspace manifests, expected entry patterns for Vite React, Astro, Hono, and shared packages, README assets for apps/packages, npm-workspaces setup files, and special-file renames
- [x] 5.5 Run the affected test/build commands and fix any verification gaps

## 6. Verification Fixes

- [x] 6.1 Add scaffold rollback cleanup for generation failures before handoff and cover it with a regression test
