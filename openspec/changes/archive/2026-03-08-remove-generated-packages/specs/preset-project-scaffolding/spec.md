## MODIFIED Requirements

### Requirement: Base preset generates the baseline project structure
The system SHALL provide a `base` preset that generates a baseline monorepo on top of npm workspaces containing `apps/web`, `apps/site`, `apps/api`, an empty reserved `packages/` directory, root workspace configuration, workspace package manifests for generated apps, and starter README assets.

#### Scenario: Phase 1 baseline scaffold is generated
- **WHEN** the user confirms generation in the phase 1 flow
- **THEN** the generated project contains the baseline apps, the reserved `packages/` directory, workspace config files, workspace package manifests for generated apps, and starter README assets defined by the `base` preset

### Requirement: Base preset includes minimal stack-specific starter files
The system SHALL generate minimal starter files that match the promised baseline stack: `React + Vite` for `apps/web`, `Astro` for `apps/site`, and `Node + Hono` for `apps/api`.

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

#### Scenario: User inspects reserved packages directory
- **WHEN** scaffold generation completes for the `base` preset
- **THEN** the generated project contains an empty `packages/` directory reserved for future shared workspaces, without marker files in that directory

### Requirement: Preset output includes the baseline README instructions
The system SHALL generate a starter README set that includes the root `README.md` and project-level `README.md` files for generated applications, and those documents SHALL remain consistent with the generated baseline project structure and setup path.

#### Scenario: User inspects generated documentation
- **WHEN** scaffold generation completes for the `base` preset
- **THEN** the generated project contains the README set and the instructions describe the same apps, reserved `packages/` directory, and setup path that the scaffold created

#### Scenario: User inspects root tooling files
- **WHEN** scaffold generation completes for the `base` preset
- **THEN** the generated project uses npm-workspaces root configuration appropriate for the baseline scaffold
