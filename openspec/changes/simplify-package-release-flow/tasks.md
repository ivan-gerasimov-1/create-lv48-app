## 1. Conventional release contract

- [x] 1.1 Define the enforced Conventional Commit policy for merges and document the supported release and non-release types
- [x] 1.2 Add CI validation that fails before merge when commit metadata cannot be interpreted by `release-please`

## 2. Release automation migration

- [x] 2.1 Add `release-please` configuration and workflow for the single published package
- [x] 2.2 Refactor the publish workflow so release PR creation and final publish run through the existing repository release gates
- [x] 2.3 Align repository release assets, scripts, and tests with the single `release-please` workflow

## 3. Documentation and regression coverage

- [ ] 3.1 Update repository release documentation and templates to describe the `release-please` + conventional commits flow
- [ ] 3.2 Update `/Users/ivan/Developer/lv48/create-lv48-app/docs/PRD.md` and `/Users/ivan/Developer/lv48/create-lv48-app/docs/SRD.md` so they no longer mention `changesets` and describe the new canonical release path
- [ ] 3.3 Refresh tests and workflow validation to cover conventional-commit enforcement, release PR generation, publish gating, and consistency of the canonical release contract
- [ ] 3.4 Run the affected verification commands for release automation and fix any issues discovered before handoff
