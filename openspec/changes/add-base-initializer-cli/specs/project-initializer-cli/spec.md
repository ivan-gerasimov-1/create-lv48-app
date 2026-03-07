## ADDED Requirements

### Requirement: CLI entrypoints start the initializer flow
The system SHALL expose the project initializer through `npm init lv48-app`, `npx create-lv48-app`, and a direct executable bin entrypoint, and each entrypoint SHALL start the same initialization flow.

#### Scenario: User starts the initializer from an npm entrypoint
- **WHEN** the user runs `npm init lv48-app` or `npx create-lv48-app`
- **THEN** the system starts the same project initialization flow without requiring a separate wrapper command

#### Scenario: User starts the initializer from the bin entrypoint
- **WHEN** the executable bin script is invoked directly
- **THEN** the system runs the same prompt, generation, and summary behavior as the npm-based entrypoints

### Requirement: Initializer collects required setup decisions
The system SHALL collect the project name, target directory, dependency-install choice, and git-initialization choice before generation, and the system SHALL use `npm` as the phase 1 package manager while applying the `base` preset by default without requiring package-manager or preset prompts.

#### Scenario: User accepts the default happy path
- **WHEN** the user provides a valid project name and accepts default phase 1 options
- **THEN** the system selects the `base` preset, uses `npm`, skips only the optional steps the user declined, and proceeds to generation

#### Scenario: User provides an explicit target directory
- **WHEN** the user selects a target directory that differs from the project name
- **THEN** the system uses that directory for generation while preserving the provided project metadata for interpolation

#### Scenario: Phase 1 flow starts without preset input
- **WHEN** the user starts the initializer in phase 1
- **THEN** the system applies the `base` preset automatically without showing a separate preset-selection prompt

### Requirement: Initializer validates names and target safety before writing files
The system SHALL validate project and package naming before generation and SHALL fail with a clear error before writing scaffold files when the target directory conflicts with the requested generation behavior.

#### Scenario: Invalid project name is rejected
- **WHEN** the user enters a project name that cannot be used as the generated package name
- **THEN** the system explains the validation failure and does not create scaffold files

#### Scenario: Target directory already contains conflicting files
- **WHEN** the user selects a target directory whose contents would be overwritten by the scaffold
- **THEN** the system stops before generation and reports the directory conflict in plain language

### Requirement: Initializer performs optional post-setup actions and reports outcome
The system SHALL allow the user to opt into dependency installation and git initialization, and it SHALL print a final summary that distinguishes completed scaffold work from any optional post-setup failures.

#### Scenario: User enables post-setup actions
- **WHEN** the user opts into dependency installation and git initialization
- **THEN** the system runs those actions after scaffold generation and includes the resulting status in the final summary

#### Scenario: Post-setup action fails after scaffold generation
- **WHEN** the scaffold has already been generated and a selected post-setup action fails
- **THEN** the system preserves the generated project, reports which step failed, and prints next steps that let the user continue manually
