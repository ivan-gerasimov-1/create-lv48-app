## MODIFIED Requirements

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
