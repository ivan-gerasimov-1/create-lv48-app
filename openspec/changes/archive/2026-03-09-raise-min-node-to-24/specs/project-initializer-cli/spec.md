## ADDED Requirements

### Requirement: Published package declares the supported Node.js runtime
The system SHALL publish the initializer package with an explicit Node.js engine requirement of `>=24.0.0` so the supported runtime contract is visible in the package metadata.

#### Scenario: User inspects the published package manifest
- **WHEN** the user or tooling reads the published `create-lv48-app` package manifest
- **THEN** the manifest declares `engines.node` as `>=24.0.0`
