# FEATURE-00004: Non-interactive config file support

| Status   | Date       |
| -------- | ---------- |
| Proposed | 2026-05-02 |

## Context

`create-lv48-app` currently collects setup answers through interactive prompts. Repeat users and automation workflows need a repeatable way to provide the same answers without manual prompt input.

## Goal

Let users create projects from a validated configuration file in non-interactive mode.

## Users / Use Cases

- User: save preferred project setup options and reuse them across projects.
- Team: commit a bootstrap config so new projects use consistent defaults.
- CI or automation: validate and run project creation without prompt interaction.

## Scope

- Add a CLI option for loading setup answers from a config file.
- Validate config values with the same domain rules used by interactive prompts.
- Report missing, invalid, or unsupported config fields with actionable errors.
- Skip interactive prompts when a complete valid config is provided.
- Preserve current interactive prompt behavior when no config file is provided.

## Non-Goals

- Do not introduce multiple preset implementations as part of this feature.
- Do not change generated template content.
- Do not persist configs automatically unless covered by a separate feature.
- Do not silently guess invalid or missing required fields.

## Acceptance Criteria

- Given a complete valid config file, when the user runs the CLI with the config option, then the project is generated without interactive prompts.
- Given an invalid config value, when the user runs the CLI with the config option, then the CLI exits with a clear validation message before writing files.
- Given no config file is provided, when the user runs the CLI, then existing interactive prompts still collect answers.
- Given automation runs the CLI with a config file, when generation succeeds, then optional post-setup choices come from config values.

## Dependencies

- CLI argument handling.
- Existing prompt answer shape and validation rules.
- Runtime validation utilities.

## Risks / Rollback

The config schema becomes user-facing behavior and may need stable compatibility expectations. Implementation may require an ADR if it establishes a durable public config contract.

Rollback is reversible by removing the config-file CLI option and keeping interactive setup as the only supported input path.

## Related Features / ADRs

- ADR-022 Use Commander for CLI argument parsing
- ADR-024 Use Zod for runtime validation in create-lv48-app
