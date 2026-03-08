# npm-package-publication Specification

## Purpose
Define the canonical release contract for publishing `create-lv48-app` as a public npm package.

## Requirements

### Requirement: Package manifest is publish-ready for public npm distribution
The system SHALL define `create-lv48-app` as a public npm package with SPDX license metadata set to `MIT`, registry-facing project links, and manifest fields that describe the publishable artifact without exposing unrelated repository files.

#### Scenario: Maintainer inspects package metadata before release
- **WHEN** the maintainer reviews the root package manifest for release readiness
- **THEN** the manifest contains the package name, version, SPDX license `MIT`, repository-facing metadata, executable bin mapping, and publish configuration needed for public npm distribution

#### Scenario: Publishable files are constrained explicitly
- **WHEN** npm resolves the package contents for packing
- **THEN** only the intended runtime files such as the executable entrypoint, compiled output, and template assets are included as publishable package contents

### Requirement: Release workflow verifies the tarball before publish
The system SHALL provide a reproducible pre-publish workflow that builds the package, runs affected verification commands, creates or dry-runs the npm tarball, and validates the release artifact before any real registry publish step.

#### Scenario: Maintainer runs the release-check workflow
- **WHEN** the maintainer starts the documented pre-publish workflow
- **THEN** the workflow executes the required build, test, and tarball verification steps in a consistent order and fails before publish if any gate fails

#### Scenario: Tarball verification detects packaging drift
- **WHEN** the packed artifact is missing a required runtime file or includes an unexpected release-breaking omission
- **THEN** the verification workflow reports the packaging failure and the maintainer does not proceed to `npm publish`

### Requirement: GitHub Actions publish reuses the verified release workflow
The system SHALL provide a GitHub Actions workflow for npm publication that is triggered via `workflow_dispatch`, uses npm trusted publishing through OIDC, runs the same release gates as the local release-check path, and only publishes after build, test, tarball verification, and packed-artifact smoke verification succeed.

#### Scenario: Maintainer triggers GitHub Actions release publish
- **WHEN** the configured GitHub Actions publish workflow is triggered through `workflow_dispatch` with trusted publishing configured for the repository
- **THEN** the workflow runs the required verification steps before executing `npm publish`

#### Scenario: GitHub Actions verification fails before publish
- **WHEN** any required build, test, tarball verification, or packed-artifact smoke step fails in GitHub Actions
- **THEN** the workflow stops before the npm publish step and reports the failed gate

### Requirement: Packed artifact can launch the initializer
The system SHALL prove that the packaged npm artifact can launch `create-lv48-app` with its runtime dependencies and template assets from the packed output, not only from the source repository.

#### Scenario: Maintainer smoke-tests the packed CLI
- **WHEN** the maintainer installs or executes the generated tarball in an isolated temporary directory
- **THEN** the packaged CLI starts successfully through its published entrypoint and resolves the template assets required for scaffold generation
