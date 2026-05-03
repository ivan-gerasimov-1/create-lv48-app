# FEATURE-00007: CLI tool template

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-05-03 |

## Context

`create-lv48-app` currently scaffolds the `base` SaaS monorepo template by default. The current generator already supports portable template definitions, placeholder replacement, reserved directories, dependency installation, git initialization, and initialization summaries, but the visible product flow does not offer a dedicated scaffold for command-line tool projects.

Engineers who want to start a TypeScript CLI currently need to adapt the generated SaaS monorepo or create a CLI package manually. A CLI tool template should make this workflow first-class while staying consistent with existing template behavior and post-setup expectations.

## Goal

Users can scaffold a ready-to-develop TypeScript CLI tool project with `create-lv48-app`, including package metadata, source entrypoint, build/test scripts, executable `bin` wiring, GitHub Actions CI/CD pipeline, publishing pipeline, README guidance, and existing post-generation options.

## Users / Use Cases

- Product or platform engineer: start a new internal CLI tool and immediately run, test, and build it.
- Library/tool maintainer: create a publishable npm CLI package with conventional `bin` entrypoint wiring.
- Automation engineer: bootstrap a small command-line utility without deleting unused web/API/site app scaffolding.

## Scope

- Add a user-selectable CLI tool template alongside the existing base SaaS monorepo scaffold.
- Generate a TypeScript npm package or workspace-shaped project suitable for a standalone CLI tool.
- Include a source CLI entrypoint with a sample command or help output.
- Include package metadata with executable `bin` configuration, build script, typecheck script, test script, release preparation script, publish script, and start/dev command where appropriate.
- Include minimal tests that verify CLI behavior or command output.
- Include a GitHub Actions CI pipeline that installs dependencies and runs validation on pull requests and pushes.
- Include a GitHub Actions release/publish workflow suitable for npm packages, using repository secrets or trusted publishing rather than generated credentials.
- Include a publishing pipeline suitable for npm packages, including package validation before publish and documented release commands.
- Include README instructions for install, local development, build, test, GitHub Actions setup, release preparation, publishing, and running the generated CLI.
- Reuse existing prompt validation, placeholder replacement, target-directory safety checks, install-dependencies option, git initialization option, and initialization summary behavior.

## Non-Goals

- Do not add registry credentials, secrets, or automatic publishing on scaffold.
- Do not publish from GitHub Actions without explicit user-provided repository configuration, such as npm provenance/trusted publishing or an npm token secret.
- Do not add a plugin system or command framework abstraction unless needed by the generated starter behavior.
- Do not support non-Node runtimes or non-TypeScript languages in this feature.
- Do not remove or replace the existing base SaaS monorepo template.
- Do not require users to generate web, site, or API apps when selecting the CLI tool template.

## Acceptance Criteria

- Given a user runs `create-lv48-app`, when choosing a scaffold/template, then `CLI tool` is available as a distinct option from the base SaaS monorepo.
- Given a user selects the CLI tool template and completes prompts, when generation succeeds, then the target directory contains only files relevant to a TypeScript CLI tool project.
- Given a generated CLI tool project, when the user runs the documented install/build/test commands, then the commands complete successfully on supported Node/npm versions.
- Given a generated CLI tool project, when code is pushed or a pull request is opened on GitHub, then the generated CI workflow runs install, typecheck, tests, build, and package validation.
- Given a generated CLI tool project, when the user runs the documented release preparation command, then package validation runs before publish.
- Given a generated CLI tool project, when the user follows the documented local publish command, then publishing uses explicit user credentials/session and does not run automatically during scaffold.
- Given a generated CLI tool project, when the generated GitHub Actions publish workflow runs, then npm publish requires explicit repository configuration and does not include generated credentials.
- Given a generated CLI tool project, when the user runs the documented local CLI command, then the sample command or help output is displayed.
- Given dependency installation or git initialization are selected, when scaffolding completes, then existing post-setup behavior and summary output report those actions for the CLI tool project.
- Given the target directory is non-empty, when the user tries to generate the CLI tool template there, then existing target safety behavior prevents conflicting writes.

## Dependencies

- ADR-005: Validate package before publish.
- ADR-009: Use typed portable template definitions.
- ADR-010: Rename template identifier to name.
- ADR-012: Use Clack for interactive CLI prompts.
- Existing template registry, prompt answer, generation runner, transform pipeline, and placeholder behavior.
- A follow-up CHANGE record to plan implementation steps and verification.

## Risks / Rollback

Adding a second template expands prompt and registry behavior that is currently hardcoded around `base`. The implementation should keep the existing base scaffold unchanged and make template selection reversible by unregistering or hiding the CLI tool template if issues appear.

Generated output becomes part of user expectations. Publishing scripts and CI/CD workflows increase risk because they affect package release behavior, repository permissions, and user credentials/sessions. If the exact CLI project shape, dependency set, GitHub Actions workflow, or publish workflow should become binding for future work, create or link an ADR before implementation. Rollback should remove the CLI template from selection while preserving existing generated base behavior and target-directory safety.

## Related Features / ADRs

- ADR-005: Validate package before publish.
- ADR-009: Use typed portable template definitions.
- ADR-010: Rename template identifier to name.
- ADR-012: Use Clack for interactive CLI prompts.
