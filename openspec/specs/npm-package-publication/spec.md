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
The system SHALL provide a GitHub Actions workflow for npm publication that is orchestrated through `release-please`, uses npm trusted publishing through OIDC, runs the same release gates as the local release-check path, and only publishes after build, test, tarball verification, and packed-artifact smoke verification succeed. The publish command SHALL remain compatible with the repository visibility used for the release. When the source repository is private and the package is public, the workflow SHALL publish without npm provenance generation.

#### Scenario: Automation prepares a release without publishing yet
- **WHEN** unreleased conventional commits exist on the default branch
- **THEN** GitHub Actions updates the generated release pull request and does not publish to npm before that pull request is merged

#### Scenario: Release commit reaches the default branch in a private repository
- **WHEN** the generated release pull request is merged through the configured default branch for a public npm package whose source repository is private
- **THEN** the workflow runs the required verification steps before executing `npm publish --access public` without `--provenance`

#### Scenario: Maintainer inspects a provenance-compatible follow-up path
- **WHEN** the source repository visibility and npm capabilities support provenance for the package being published
- **THEN** the documented release contract may enable provenance in a follow-up change without weakening the required verification gates

#### Scenario: GitHub Actions verification fails before publish
- **WHEN** any required build, test, tarball verification, or packed-artifact smoke step fails in the automated release workflow
- **THEN** the workflow stops before the npm publish step and reports the failed gate

### Requirement: Packed artifact can launch the initializer
The system SHALL prove that the packaged npm artifact can launch `create-lv48-app` with its runtime dependencies and template assets from the packed output, not only from the source repository.

#### Scenario: Maintainer smoke-tests the packed CLI
- **WHEN** the maintainer installs or executes the generated tarball in an isolated temporary directory
- **THEN** the packaged CLI starts successfully through its published entrypoint and resolves the template assets required for scaffold generation
