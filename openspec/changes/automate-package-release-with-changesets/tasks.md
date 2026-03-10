## 1. Changesets setup

- [x] 1.1 Add `changesets` tooling and repository configuration for the single published package
- [x] 1.2 Define the release scripts needed for release PR preparation and final publish while reusing the existing `release:check` gates
- [x] 1.3 Define the supported PR release labels and the deterministic generated changeset file contract for a single pull request

## 2. Pull request changeset automation

- [x] 2.1 Add a PR-level GitHub Actions workflow that creates, updates, or removes the generated changeset file based on the current release label and PR metadata
- [x] 2.2 Ensure the PR automation updates only its owned generated changeset file and safely re-runs when the PR title, labels, or commits change
- [x] 2.3 Add validation or CI guardrails so unsupported or missing release labels are surfaced clearly for releasable pull requests

## 3. GitHub Actions release automation

- [x] 3.1 Replace or refactor the current publish workflow into a changesets-driven release workflow that updates a release pull request from `main`
- [x] 3.2 Configure the automated publish path so merge of the generated release pull request triggers `npm publish --access public` through the repository publish script and existing OIDC permissions
- [x] 3.3 Update workflow validation so static checks assert the new PR-sync plus changesets release orchestration instead of the old manual `workflow_dispatch` contract

## 4. Release documentation and verification

- [x] 4.1 Update release documentation to describe the new label -> generated changeset -> release PR -> publish flow and the maintainer responsibilities inside it
- [x] 4.2 Run the affected verification commands for the release toolchain and fix any issues discovered before handoff
