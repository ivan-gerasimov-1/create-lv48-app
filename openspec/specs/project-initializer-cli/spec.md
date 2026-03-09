# project-initializer-cli Specification

## Purpose
Define the canonical behavior for the project initializer CLI that scaffolds a new lv48 application using the phase 1 default flow.
## Requirements
### Requirement: CLI entrypoints start the initializer flow
The system SHALL expose the project initializer through `npm init lv48-app`, `npx create-lv48-app`, and a direct executable bin entrypoint, and each entrypoint SHALL start the same initialization flow from the published npm artifact as well as from the local package source.

#### Scenario: User starts the initializer from an npm entrypoint
- **WHEN** the user runs `npm init lv48-app` or `npx create-lv48-app`
- **THEN** the system starts the same project initialization flow without requiring a separate wrapper command

#### Scenario: User starts the initializer from the bin entrypoint
- **WHEN** the executable bin script is invoked directly
- **THEN** the system runs the same prompt, generation, and summary behavior as the npm-based entrypoints

#### Scenario: Published package includes runtime assets for the initializer
- **WHEN** the initializer is executed from the packed or published npm package
- **THEN** the entrypoint can resolve its compiled runtime files and template assets without requiring files that exist only in the source repository

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
The system SHALL allow the user to opt into dependency installation and git initialization, it SHALL create the generated repository with `main` as the initial branch whenever git initialization is selected, it SHALL emit visible progress messages when selected post-setup actions start running, and it SHALL print a final summary that distinguishes completed scaffold work from any optional post-setup failures.

#### Scenario: User enables post-setup actions
- **WHEN** the user opts into dependency installation and git initialization
- **THEN** the system runs those actions after scaffold generation, emits progress messages identifying each selected action as it starts, and includes the resulting status in the final summary

#### Scenario: Git initialization creates a repository on main
- **WHEN** the user opts into git initialization for a newly generated project
- **THEN** the system initializes the repository so the current local branch is `main` instead of inheriting the machine-specific Git default branch name

#### Scenario: Post-setup action fails after scaffold generation
- **WHEN** the scaffold has already been generated and a selected post-setup action fails
- **THEN** the system preserves the generated project, reports which step failed, and prints next steps that let the user continue manually

### Requirement: Published package declares the supported Node.js runtime
The system SHALL publish the initializer package with an explicit Node.js engine requirement of `>=24.0.0` so the supported runtime contract is visible in the package metadata.

#### Scenario: User inspects the published package manifest
- **WHEN** the user or tooling reads the published `create-lv48-app` package manifest
- **THEN** the manifest declares `engines.node` as `>=24.0.0`

