# release-please-management Specification

## Purpose
Define the canonical release-intent and release-orchestration contract for `create-lv48-app` through conventional commits, a generated release pull request, and automated changelog management.

## Requirements
### Requirement: Release intent is recorded through conventional commits
The system SHALL require release-affecting changes for `create-lv48-app` to use supported Conventional Commit messages or pull request titles that `release-please` can interpret deterministically for semantic versioning and changelog generation.

#### Scenario: Patch change is merged
- **WHEN** a maintainer merges a change with a supported patch-level conventional type such as `fix:`
- **THEN** release automation treats that change as a patch candidate for the next release pull request

#### Scenario: Minor change is merged
- **WHEN** a maintainer merges a change with a supported minor-level conventional type such as `feat:`
- **THEN** release automation treats that change as a minor candidate for the next release pull request

#### Scenario: Breaking change is merged
- **WHEN** a maintainer merges a change whose conventional commit metadata includes a breaking marker such as `!` or a `BREAKING CHANGE` footer
- **THEN** release automation treats that change as a major candidate for the next release pull request

#### Scenario: Commit metadata is invalid
- **WHEN** a change intended for merge does not match the documented Conventional Commit contract
- **THEN** CI fails clearly before merge and explains that release automation cannot determine the release intent

### Requirement: Release pull request is maintained from default-branch history
The system SHALL use `release-please` to create or update a dedicated release pull request from the merged history of the default branch, including version bumps and changelog updates derived from supported conventional commits.

#### Scenario: Releasable commits reach the default branch
- **WHEN** merged commits on the default branch include unreleased conventional changes
- **THEN** `release-please` creates or updates a release pull request with the computed version bump and changelog entries for `create-lv48-app`

#### Scenario: No releasable commits remain
- **WHEN** there are no unreleased conventional changes eligible for publication
- **THEN** automation does not keep an outdated release pull request open

### Requirement: Changelog generation is owned by release automation
The system SHALL generate the release changelog from the conventional-commit history through `release-please`.

#### Scenario: Maintainer reviews the pending release
- **WHEN** a maintainer opens the generated release pull request
- **THEN** the pull request diff and body show the version bump and changelog entries derived from unreleased conventional changes

#### Scenario: Non-releasing maintenance change is merged
- **WHEN** a merged change uses a supported non-releasing conventional type that is configured to skip version bumps
- **THEN** release automation excludes that change from the next published version bump

### Requirement: Repository release assets follow a single canonical workflow
The system SHALL expose only one active release-management workflow based on `release-please`, conventional commits, and the generated release pull request.

#### Scenario: Maintainer inspects repository release assets
- **WHEN** a maintainer reviews the repository release workflows, configuration, and documentation
- **THEN** they describe a single `release-please`-based release path for `create-lv48-app`
