## Why

The current npm publication flow assumes GitHub Actions provenance for every public release. That breaks when the source repository is private, even though publishing a public npm package from a private repository is a valid supported workflow.

## What Changes

- Update the npm publication contract to support publishing a public package from a private GitHub repository.
- Remove the requirement that the GitHub Actions publish step always uses `--provenance`.
- Clarify the supported authentication modes: trusted publishing without provenance for private repositories, or token-based publish when trusted publishing is not configured.
- Update release documentation and verification so the documented CI path matches the supported repository-visibility constraints.

## Non-goals

- Changing the package from public to private in npm.
- Redesigning the release pipeline beyond the visibility/provenance constraint.
- Adding automated versioning, changelog generation, or release orchestration.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `npm-package-publication`: refine the GitHub Actions publication requirements so public npm release remains supported when the source repository is private.

## Impact

Affected areas: `.github/workflows/publish.yml`, publish workflow validation, release documentation, and the `npm-package-publication` specification.
