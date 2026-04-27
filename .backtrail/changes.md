# Change Log

This log tracks implementation plans and delivery records for the project.

Use CHANGE records for ADR-backed implementation plans and for non-ADR task plans that need durable execution context.

## Process

- Create a CHANGE record when implementation work needs explicit scope, steps, verification, and rollback.
- Link ADR-backed changes to the relevant ADRs.
- Use standalone CHANGE records for non-ADR implementation plans when a commit, issue, or pull request note is not enough.
- Store each change in `.backtrail/changes/change-NNNNN-title-slug.md`.
- Use ISO dates in `YYYY-MM-DD` format.

## Status Values

- `Proposed`: planned but not started.
- `In Progress`: being implemented.
- `Done`: implemented and verified.
- `Blocked`: waiting on an external decision or prerequisite.
- `Abandoned`: no longer planned or applicable.

## Changes

| Change                                                                                        | Date       | Status    | ADRs                                                                                 | Title                                                 |
| --------------------------------------------------------------------------------------------- | ---------- | --------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| [CHANGE-001](./changes/change-00001-use-vitest-for-tests.md)                                  | 2026-04-14 | Done      | [ADR-001](./adrs/adr-00001-use-vitest-for-tests.md)                                  | Use Vitest for tests                                  |
| [CHANGE-002](./changes/change-00002-colocate-test-files-with-tested-code.md)                  | 2026-04-14 | Done      | [ADR-002](./adrs/adr-00002-colocate-test-files-with-tested-code.md)                  | Colocate test files with tested code                  |
| [CHANGE-003](./changes/change-00003-support-single-and-multi-project-workspace-layouts.md)    | 2026-04-14 | Done      | [ADR-003](./adrs/adr-00003-support-single-and-multi-project-workspace-layouts.md)    | Support single and multi-project workspace layouts    |
| [CHANGE-004](./changes/change-00004-use-tsdown-for-cli-builds.md)                             | 2026-04-15 | Done      | [ADR-004](./adrs/adr-00004-use-tsdown-for-cli-builds.md)                             | Use tsdown for CLI builds                             |
| [CHANGE-005](./changes/change-00005-validate-package-before-publish.md)                       | 2026-04-15 | Done      | [ADR-005](./adrs/adr-00005-validate-package-before-publish.md)                       | Validate package before publish                       |
| [CHANGE-006](./changes/change-00006-avoid-project-owned-index-files.md)                       | 2026-04-15 | Done      | [ADR-006](./adrs/adr-00006-avoid-project-owned-index-files.md)                       | Avoid project-owned index files                       |
| [CHANGE-007](./changes/change-00007-migrate-templates-to-vite-8-and-rolldown-backed-astro.md) | 2026-04-15 | Done      | [ADR-007](./adrs/adr-00007-migrate-templates-to-vite-8-and-rolldown-backed-astro.md) | Migrate templates to Vite 8 and Rolldown-backed Astro |
| [CHANGE-008](./changes/change-00008-include-shadcn-v4-in-base-web-template.md)                | 2026-04-15 | Done      | [ADR-008](./adrs/adr-00008-include-shadcn-v4-in-base-web-template.md)                | Include shadcn v4 in base web template                |
| [CHANGE-009](./changes/change-00009-use-typed-portable-template-definitions.md)               | 2026-04-16 | Done      | [ADR-009](./adrs/adr-00009-use-typed-portable-template-definitions.md)               | Use typed portable template definitions               |
| [CHANGE-010](./changes/change-00010-rename-template-identifier-to-name.md)                    | 2026-04-16 | Done      | [ADR-010](./adrs/adr-00010-rename-template-identifier-to-name.md)                    | Rename template identifier to name                    |
| [CHANGE-011](./changes/change-00011-use-template-terminology-consistently.md)                 | 2026-04-16 | Abandoned | [ADR-011](./adrs/adr-00011-use-template-terminology-consistently.md)                 | Use template terminology consistently                 |
| [CHANGE-012](./changes/change-00012-use-clack-for-interactive-cli-prompts.md)                 | 2026-04-16 | Done      | [ADR-012](./adrs/adr-00012-use-clack-for-interactive-cli-prompts.md)                 | Use Clack for interactive CLI prompts                 |
| [CHANGE-013](./changes/change-00013-restrict-default-parameters-to-simple-literals.md)        | 2026-04-16 | Done      | [ADR-013](./adrs/adr-00013-restrict-default-parameters-to-simple-literals.md)        | Restrict default parameters to simple literals        |
| [CHANGE-014](./changes/change-00014-split-decisions-from-changes.md)                          | 2026-04-16 | Done      | [ADR-014](./adrs/adr-00014-split-decisions-from-changes.md)                          | Split decisions from changes                          |
| [CHANGE-015](./changes/change-00015-use-class-based-post-setup-orchestration.md)              | 2026-04-16 | Done      | [ADR-015](./adrs/adr-00015-use-class-based-post-setup-orchestration.md)              | Use class-based post-setup orchestration              |
| [CHANGE-016](./changes/change-00016-use-kebab-case-names-for-decision-and-change-docs.md)     | 2026-04-23 | Done      | [ADR-016](./adrs/adr-00016-use-kebab-case-names-for-decision-and-change-docs.md)     | Use kebab-case names for decision and change docs     |
| [CHANGE-017](./changes/change-00017-omit-extensions-in-typescript-imports.md)                 | 2026-04-24 | Done      | -                                                                                    | Omit extensions in TypeScript imports                 |
| [CHANGE-018](./changes/change-00018-remove-version-flag.md)                                   | 2026-04-25 | Done      | -                                                                                    | Remove version flag                                   |
| [CHANGE-019](./changes/change-00019-use-package-import-aliases-for-project-source.md)         | 2026-04-25 | Done      | [ADR-017](./adrs/adr-00017-use-package-import-aliases-for-project-source.md)         | Use package import aliases for project source         |
| [CHANGE-020](./changes/change-00020-use-package-and-templates-root-constants.md)              | 2026-04-25 | Done      | -                                                                                    | Use package and templates root constants              |
| [CHANGE-021](./changes/change-00021-align-logtrail-number-placeholders-with-adr-naming.md)    | 2026-04-25 | Done      | [ADR-016](./adrs/adr-00016-use-kebab-case-names-for-decision-and-change-docs.md)     | Align Logtrail number placeholders with ADR naming    |
| [CHANGE-022](./changes/change-00022-move-logtrail-docs-to-logtrail-directory.md)              | 2026-04-25 | Done      | [ADR-018](./adrs/adr-00018-move-logtrail-docs-to-logtrail-directory.md)              | Move Logtrail docs to .logtrail directory             |
| [CHANGE-023](./changes/change-00023-rewrite-initialization-summary-as-class.md)               | 2026-04-25 | Done      | -                                                                                    | Rewrite initialization summary as class               |
| [CHANGE-024](./changes/change-00024-build-cli-entrypoint-to-bin.md)                           | 2026-04-25 | Done      | [ADR-019](./adrs/adr-00019-build-cli-entrypoint-to-bin.md)                           | Build CLI entrypoint to bin                           |
| [CHANGE-025](./changes/change-00025-use-default-dist-cli-build-output.md)                     | 2026-04-25 | Done      | [ADR-020](./adrs/adr-00020-use-default-dist-cli-build-output.md)                     | Use default dist CLI build output                     |
| [CHANGE-026](./changes/change-00026-create-class-based-logger-module.md)                      | 2026-04-25 | Done      | -                                                                                    | Create class-based logger module                      |
| [CHANGE-027](./changes/change-00027-integrate-class-based-logger-module.md)                   | 2026-04-25 | Done      | -                                                                                    | Integrate class-based logger module                   |
| [CHANGE-028](./changes/change-00028-create-class-based-preset-registry-module.md)             | 2026-04-25 | Done      | -                                                                                    | Create class-based preset registry module             |
| [CHANGE-029](./changes/change-00029-register-base-preset-in-registry.md)                      | 2026-04-25 | Done      | -                                                                                    | Register base preset in registry                      |
| [CHANGE-030](./changes/change-00030-rename-logtrail-to-backtrail.md)                          | 2026-04-26 | Done      | [ADR-021](./adrs/adr-00021-rename-logtrail-to-backtrail.md)                          | Rename Logtrail to Backtrail                          |
| [CHANGE-031](./changes/change-00031-support-version-flag.md)                                  | 2026-04-26 | Done      | -                                                                                    | Support version flag                                  |
| [CHANGE-032](./changes/change-00032-use-commander-for-cli-argument-parsing.md)                | 2026-04-26 | Proposed  | [ADR-022](./adrs/adr-00022-use-commander-for-cli-argument-parsing.md)                | Use Commander for CLI argument parsing                |
| [CHANGE-033](./changes/change-00033-add-node-entrypoint-to-base-api-template.md)              | 2026-04-26 | Done      | -                                                                                    | Add Node entrypoint to base API template              |
| [CHANGE-034](./changes/change-00034-refactor-generation-runner-as-class.md)                   | 2026-04-26 | Done      | -                                                                                    | Refactor generation runner as class                   |
| [CHANGE-035](./changes/change-00035-add-either-validation-container.md)                       | 2026-04-26 | Done      | [ADR-023](./adrs/adr-00023-use-either-for-typed-result-values.md)                    | Add Either container                                  |
| [CHANGE-036](./changes/change-00036-use-either-in-validation.md)                              | 2026-04-26 | Done      | [ADR-023](./adrs/adr-00023-use-either-for-typed-result-values.md)                    | Use Either in validation                              |
| [CHANGE-037](./changes/change-00037-use-zod-for-validation.md)                                | 2026-04-26 | Done      | [ADR-024](./adrs/adr-00024-use-zod-for-runtime-validation.md)                        | Use Zod for validation                                |
| [CHANGE-038](./changes/change-00038-refactor-transform-pipeline-as-class.md)                  | 2026-04-27 | Proposed  | -                                                                                    | Refactor transform pipeline as class                  |
| [CHANGE-039](./changes/change-00039-return-either-from-transform-pipeline.md)                 | 2026-04-27 | Proposed  | [ADR-023](./adrs/adr-00023-use-either-for-typed-result-values.md)                    | Return Either from transform pipeline                 |
