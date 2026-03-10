# changeset-release-management Specification

## Purpose
Define the canonical release-intent and release-orchestration contract for `create-lv48-app` through pull request labels, managed changeset files, and a generated release pull request.

## Requirements
### Requirement: Release intent is recorded through PR labels and generated changeset files
The system SHALL require publish-affecting changes for `create-lv48-app` to declare their release intent through approved pull request labels, and GitHub Actions SHALL translate that release intent into checked-in changeset files that encode the semantic version bump and changelog summary before release preparation begins.

#### Scenario: Contributor marks a releasable pull request
- **WHEN** a contributor or maintainer applies a supported release label to a pull request that must be released in npm
- **THEN** GitHub Actions creates or updates a changeset file for that pull request with the matching bump type and release summary for `create-lv48-app`

#### Scenario: Pull request is marked as non-releasing
- **WHEN** a contributor or maintainer applies the `release:none` label to the pull request
- **THEN** GitHub Actions removes or disables the generated changeset file for that pull request so it no longer contributes to the next release

#### Scenario: Maintainer reviews release intent before publish
- **WHEN** the maintainer inspects pending unreleased work
- **THEN** the set of unreleased generated changesets shows which semantic version update and changelog entries will be applied in the next release PR

#### Scenario: Pull request has no supported release label
- **WHEN** a pull request has zero or multiple supported release labels
- **THEN** the pull request automation fails with a clear error that the release intent must be expressed by exactly one approved label

### Requirement: Automation maintains a release pull request from pending changesets
The system SHALL provide GitHub Actions automation that detects unreleased changesets on the default branch and creates or updates a dedicated release pull request that applies version bumps and changelog updates derived from those changesets.

#### Scenario: New unreleased changesets land on the default branch
- **WHEN** commits containing unreleased changeset files reach the default branch
- **THEN** the automation creates or updates a release pull request with the generated version bump and changelog diff for `create-lv48-app`

#### Scenario: No unreleased changesets remain
- **WHEN** there are no pending changeset files for the package
- **THEN** the automation does not keep an outdated release pull request open for publication

### Requirement: Changeset synchronization is deterministic for each pull request
The system SHALL ensure that PR-level changeset automation updates only the generated changeset file owned by that pull request and recomputes it whenever the pull request title, release label, or head commit changes.

#### Scenario: Pull request content changes after the label is set
- **WHEN** new commits are pushed to a pull request that already has a supported release label
- **THEN** GitHub Actions re-runs the synchronization logic and updates only that pull request's generated changeset file as needed

#### Scenario: Pull request title changes
- **WHEN** the pull request title changes while a supported release label is still present
- **THEN** GitHub Actions refreshes the generated changeset summary so the release PR reflects the latest pull request metadata

### Requirement: Publish runs only from the merged release commit
The system SHALL publish to npm only after the generated release pull request is merged into the default branch, and the publish path SHALL run from that merged release state instead of from feature branches or unmerged pull request heads.

#### Scenario: Release pull request is merged
- **WHEN** the release pull request produced by the automation is merged into the default branch
- **THEN** the publish workflow runs from the merged default-branch commit and treats that commit as the source of truth for the npm release

#### Scenario: Non-release branch updates occur
- **WHEN** a branch or pull request that is not the generated release pull request is updated
- **THEN** the system does not publish a new npm version from that branch state
