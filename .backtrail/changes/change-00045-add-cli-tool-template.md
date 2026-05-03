# CHANGE-00045: Add CLI tool template

| Status   | Date       | ADRs                                                                                                                                                                                                                                                                                | Blocked By | Blocks |
| -------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------ |
| Proposed | 2026-05-03 | [ADR-005](../adrs/adr-00005-validate-package-before-publish.md), [ADR-009](../adrs/adr-00009-use-typed-portable-template-definitions.md), [ADR-010](../adrs/adr-00010-rename-template-identifier-to-name.md), [ADR-012](../adrs/adr-00012-use-clack-for-interactive-cli-prompts.md) | -          | -      |

## Goal

Implement [FEATURE-00007](../features/feature-00007-cli-tool-template.md) by adding a selectable TypeScript CLI tool scaffold that generates a ready-to-develop npm CLI package without changing the existing base SaaS monorepo output.

## Scope

Included:

- Add a `cli tool` template definition and template files under the existing typed portable template convention.
- Register the CLI template alongside the existing `base` preset and expose it through prompt selection.
- Generate CLI-focused package metadata, executable `bin` wiring, TypeScript source entrypoint, tests, README guidance, GitHub Actions validation, and publish workflow scaffolding.
- Preserve existing target-directory safety checks, placeholder replacement, dependency installation option, git initialization option, and initialization summary behavior.
- Add unit tests and template-output checks that cover preset selection, generated CLI files, scripts, workflows, and sample CLI behavior.

Excluded:

- Adding generated registry credentials, secrets, or automatic publish behavior.
- Removing or changing the existing `base` SaaS monorepo scaffold.
- Adding a command framework abstraction or plugin system unless a separate ADR/CHANGE approves that durable dependency choice.
- Supporting non-Node runtimes or non-TypeScript templates.

## Implementation

1. Extend template and prompt types so preset/template names support both `base` and the new CLI template without reintroducing `id` terminology.
2. Add `templates/cliTool/template.ts` and `templates/cliTool/files/` using the fixed sibling `files` convention from ADR-009.
3. Register the CLI template in the preset registry and keep the default preset as `base` for backward-compatible interactive behavior.
4. Add an interactive template selection prompt before workspace-layout-specific prompts, and only ask base-specific workspace/app prompts when the selected template needs them.
5. Add CLI-template placeholders for project/package/display names and executable command naming while reusing existing validation and transform behavior.
6. Populate generated CLI files: `package.json`, `tsconfig.json`, source CLI entrypoint, colocated tests, README, `.gitignore`, `.npmrc` if needed, and GitHub Actions CI/publish workflow files.
7. Wire generated package scripts for dev/start, typecheck, test, build, release preparation, and publish, with package validation before publish per ADR-005.
8. Update tests for prompt collection, preset registry behavior, generation output, placeholder replacement, post-generation summary, and generated CLI project command validation.

If implementation requires a binding new choice for command framework, generated package manager support beyond npm, publish credential strategy, or generated build stack beyond the accepted ADRs, stop and create an ADR before coding that part.

## Verification

Run:

```bash
npm run test
npm run build
```

Generate the CLI template into a temporary directory and run the generated project commands:

```bash
npm install
npm run typecheck
npm run test
npm run build
npm run release:prepare
```

Expected result:

- `CLI tool` appears as a distinct selectable template.
- Selecting it creates only CLI-tool-relevant files.
- Existing `base` generation tests and behavior remain unchanged.
- Generated CLI package validates, builds, tests, and documents local run/publish steps.
- Generated GitHub Actions workflows contain no generated credentials or automatic secret values.

## Rollback

Remove the CLI template registration and hide the template selection option, then delete `templates/cliTool` and any CLI-template-specific tests/types. Keep existing `base` preset behavior and target-directory safety checks unchanged. If partial generation code was changed, revert prompt and preset type changes to the single-template `base` path.
