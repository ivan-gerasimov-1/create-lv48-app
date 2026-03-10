## 1. Changesets setup

- [ ] 1.1 Add `changesets` tooling and repository configuration for the single published package
- [ ] 1.2 Define the release scripts needed for release PR preparation and final publish while reusing the existing `release:check` gates
- [ ] 1.3 Document the contributor rule for when a changeset file is required and what bump types are expected

## 2. GitHub Actions release automation

- [ ] 2.1 Replace or refactor the current publish workflow into a changesets-driven release workflow that updates a release pull request from `main`
- [ ] 2.2 Configure the automated publish path so merge of the generated release pull request triggers `npm publish --access public` through the repository publish script and existing OIDC permissions
- [ ] 2.3 Update workflow validation so static checks assert the new changesets orchestration instead of the old manual `workflow_dispatch` contract

## 3. Release documentation and verification

- [ ] 3.1 Update release documentation to describe the new changeset -> release PR -> publish flow and the maintainer responsibilities inside it
- [ ] 3.2 Run the affected verification commands for the release toolchain and fix any issues discovered before handoff
