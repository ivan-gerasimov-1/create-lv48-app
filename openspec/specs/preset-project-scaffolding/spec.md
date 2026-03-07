# preset-project-scaffolding Specification

## Purpose
Define the canonical baseline scaffold produced by the `base` preset, including generated structure, file transforms, starter assets, and metadata-driven generation behavior.

## Requirements

### Requirement: Base preset generates the baseline project structure
The system SHALL provide a `base` preset that generates a baseline monorepo on top of npm workspaces containing `apps/web`, `apps/site`, `apps/api`, `packages/config`, `packages/ui`, `packages/types`, `packages/utils`, root workspace configuration, workspace package manifests, and starter README assets.

#### Scenario: Phase 1 baseline scaffold is generated
- **WHEN** the user confirms generation in the phase 1 flow
- **THEN** the generated project contains the baseline apps, shared packages, workspace config files, workspace package manifests, and starter README assets defined by the `base` preset

### Requirement: Preset generation applies placeholder interpolation consistently
The system SHALL replace centralized placeholder keys in template assets with project-specific values, including project naming, package naming, display naming, and starter metadata values used by the preset.

#### Scenario: Template file contains project placeholders
- **WHEN** a template file contains placeholders for project-specific metadata
- **THEN** the generated file contains the resolved values for the new project instead of the raw placeholder tokens

### Requirement: Preset generation handles special-file and JSON transforms safely
The system SHALL rename special template files such as `_gitignore` to their runtime names during generation, and it SHALL apply structural JSON updates to generated metadata files instead of relying only on blind string replacement.

#### Scenario: Template includes a special file placeholder name
- **WHEN** the base preset contains `_gitignore`
- **THEN** the generated project contains `.gitignore` with the intended contents

#### Scenario: Generated package metadata requires project-specific values
- **WHEN** root or workspace `package.json` files need project-specific metadata
- **THEN** the system writes valid JSON with the resolved package names and metadata fields

### Requirement: Base preset includes minimal stack-specific starter files
The system SHALL generate minimal starter files that match the promised baseline stack: `React + Vite` for `apps/web`, `Astro` for `apps/site`, `Node + Hono` for `apps/api`, and minimal `src/index.ts` entrypoints for shared packages.

#### Scenario: User inspects generated web app files
- **WHEN** scaffold generation completes for the `base` preset
- **THEN** `apps/web` contains a Vite-based React starter with its own `package.json`, `index.html`, and TypeScript entry files

#### Scenario: Smoke verification checks web starter semantics
- **WHEN** the phase 1 smoke test inspects `apps/web`
- **THEN** it verifies the generated files match the expected Vite + React entry pattern, including `index.html`, `src/main.tsx`, `src/App.tsx`, and `vite.config.ts`, instead of only checking file presence

#### Scenario: User inspects generated site files
- **WHEN** scaffold generation completes for the `base` preset
- **THEN** `apps/site` contains an Astro starter with its own `package.json`, `astro.config.mjs`, and a starter page

#### Scenario: Smoke verification checks site starter semantics
- **WHEN** the phase 1 smoke test inspects `apps/site`
- **THEN** it verifies the generated files match the expected Astro entry pattern, including `astro.config.mjs` and `src/pages/index.astro`, instead of only checking file presence

#### Scenario: User inspects generated api files
- **WHEN** scaffold generation completes for the `base` preset
- **THEN** `apps/api` contains a Node + Hono starter with its own `package.json` and server entry file

#### Scenario: Smoke verification checks api starter semantics
- **WHEN** the phase 1 smoke test inspects `apps/api`
- **THEN** it verifies the generated files match the expected minimal Hono entry pattern, including `src/index.ts` bootstrapping the Hono app, instead of only checking file presence

#### Scenario: User inspects generated shared packages
- **WHEN** scaffold generation completes for the `base` preset
- **THEN** each generated shared package contains its own `package.json`, `README.md`, and minimal `src/index.ts` entrypoint

#### Scenario: Smoke verification checks shared package entrypoints
- **WHEN** the phase 1 smoke test inspects generated shared packages
- **THEN** it verifies each package entrypoint matches the expected minimal `src/index.ts` pattern instead of only checking file presence

### Requirement: Preset output includes the baseline README instructions
The system SHALL generate a starter README set that includes the root `README.md` and project-level `README.md` files for generated applications and shared packages, and those documents SHALL remain consistent with the generated baseline project structure and setup path.

#### Scenario: User inspects generated documentation
- **WHEN** scaffold generation completes for the `base` preset
- **THEN** the generated project contains the README set and the instructions describe the same apps, packages, and setup path that the scaffold created

#### Scenario: User inspects root tooling files
- **WHEN** scaffold generation completes for the `base` preset
- **THEN** the generated project uses npm-workspaces root configuration appropriate for the baseline scaffold

### Requirement: Preset behavior is driven by explicit preset metadata
The system SHALL resolve scaffolding behavior from explicit preset metadata that declares the preset identity, supported package-manager values, placeholder keys, and any optional post-generation rules.

#### Scenario: CLI resolves default preset metadata before generation
- **WHEN** the phase 1 generation flow starts
- **THEN** the system loads the `base` preset metadata before generation and uses it to determine which template assets and placeholder values are valid for the scaffold
