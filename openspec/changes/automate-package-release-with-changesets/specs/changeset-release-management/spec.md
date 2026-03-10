## ADDED Requirements

### Requirement: Release intent is recorded through changeset files
The system SHALL require publish-affecting changes for `create-lv48-app` to declare their release intent through checked-in changeset files that encode the semantic version bump and changelog summary before release preparation begins.

#### Scenario: Contributor prepares a package-affecting change
- **WHEN** a contributor makes a change that must be released in npm
- **THEN** the repository provides a changeset file for that change with a valid bump type and release summary for `create-lv48-app`

#### Scenario: Maintainer reviews release intent before publish
- **WHEN** the maintainer inspects pending unreleased work
- **THEN** the set of unreleased changesets shows which semantic version update and changelog entries will be applied in the next release PR

### Requirement: Automation maintains a release pull request from pending changesets
The system SHALL provide GitHub Actions automation that detects unreleased changesets on the default branch and creates or updates a dedicated release pull request that applies version bumps and changelog updates derived from those changesets.

#### Scenario: New unreleased changesets land on the default branch
- **WHEN** commits containing unreleased changeset files reach the default branch
- **THEN** the automation creates or updates a release pull request with the generated version bump and changelog diff for `create-lv48-app`

#### Scenario: No unreleased changesets remain
- **WHEN** there are no pending changeset files for the package
- **THEN** the automation does not keep an outdated release pull request open for publication

### Requirement: Publish runs only from the merged release commit
The system SHALL publish to npm only after the generated release pull request is merged into the default branch, and the publish path SHALL run from that merged release state instead of from feature branches or unmerged pull request heads.

#### Scenario: Release pull request is merged
- **WHEN** the release pull request produced by the automation is merged into the default branch
- **THEN** the publish workflow runs from the merged default-branch commit and treats that commit as the source of truth for the npm release

#### Scenario: Non-release branch updates occur
- **WHEN** a branch or pull request that is not the generated release pull request is updated
- **THEN** the system does not publish a new npm version from that branch state
