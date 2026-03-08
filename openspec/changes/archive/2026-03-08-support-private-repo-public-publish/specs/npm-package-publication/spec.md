## MODIFIED Requirements

### Requirement: GitHub Actions publish reuses the verified release workflow
The system SHALL provide a GitHub Actions workflow for npm publication that is triggered via `workflow_dispatch`, uses npm trusted publishing through OIDC, runs the same release gates as the local release-check path, and only publishes after build, test, tarball verification, and packed-artifact smoke verification succeed. The publish command SHALL remain compatible with the repository visibility used for the release. When the source repository is private and the package is public, the workflow SHALL publish without npm provenance generation.

#### Scenario: Maintainer triggers GitHub Actions release publish from a private repository
- **WHEN** the configured GitHub Actions publish workflow is triggered through `workflow_dispatch` for a public npm package whose source repository is private
- **THEN** the workflow runs the required verification steps before executing `npm publish --access public` without `--provenance`

#### Scenario: Maintainer triggers GitHub Actions release publish from a provenance-compatible repository
- **WHEN** the source repository visibility and npm capabilities support provenance for the package being published
- **THEN** the documented release contract may enable provenance in a follow-up change without weakening the required verification gates

#### Scenario: GitHub Actions verification fails before publish
- **WHEN** any required build, test, tarball verification, or packed-artifact smoke step fails in GitHub Actions
- **THEN** the workflow stops before the npm publish step and reports the failed gate
