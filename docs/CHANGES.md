# Change Log

This log tracks implementation plans and delivery records for the project.

Use CHANGE records for ADR-backed implementation plans and for non-ADR task plans that need durable execution context.

## Process

- Create a CHANGE record when implementation work needs explicit scope, steps, verification, and rollback.
- Link ADR-backed changes to the relevant ADRs.
- Use standalone CHANGE records for non-ADR implementation plans when a commit, issue, or pull request note is not enough.
- Store each change in `docs/changes/change-NNNNN-title-slug.md`.
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
