## MODIFIED Requirements

### Requirement: Base preset generates the baseline project structure
The system SHALL provide a `base` preset that generates a baseline monorepo on top of npm workspaces containing `apps/web`, `apps/site`, `apps/api`, an empty reserved `packages/` directory, root workspace configuration, workspace package manifests for generated apps, and starter README assets, and the generated package manifests SHALL declare Node.js `>=24.0.0`.

#### Scenario: Phase 1 baseline scaffold is generated
- **WHEN** the user confirms generation in the phase 1 flow
- **THEN** the generated project contains the baseline apps, the reserved `packages/` directory, workspace config files, workspace package manifests for generated apps, and starter README assets defined by the `base` preset
- **AND** the root workspace manifest declares `engines.node` as `>=24.0.0`
- **AND** each generated app manifest declares `engines.node` as `>=24.0.0`

### Requirement: Preset output includes the baseline README instructions
The system SHALL generate a starter README set that includes the root `README.md` and project-level `README.md` files for generated applications, and those documents SHALL remain consistent with the generated baseline project structure, setup path, web starter conventions including Tailwind CSS `v4` and shadcn-ready usage expectations where relevant, and the Node.js 24 runtime requirement.

#### Scenario: User inspects generated documentation
- **WHEN** scaffold generation completes for the `base` preset
- **THEN** the generated project contains the README set and the instructions describe the same apps, reserved `packages/` directory, setup path, and the prepared frontend baseline for `apps/web` that the scaffold created
- **AND** the root README tells the user that Node.js 24 or newer is required before installing dependencies
