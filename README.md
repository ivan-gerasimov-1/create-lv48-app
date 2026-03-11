# create-lv48-app

Opinionated initializer for TS-first SaaS projects.

## Release workflow

### Local pre-publish checks

Run the full release gate locally before merge or before debugging a release issue:

```bash
npm run release:check
```

This runs:

- `npm run typecheck`
- `npm run build`
- `npm run test`
- `npm run release:verify-pack`
- `npm run release:smoke`

### Conventional release intent

Every merge that should remain compatible with `release-please` must expose release intent through Conventional Commit metadata that CI can validate before merge.

Enforced merge policy:

- merge pull requests with squash so the final pull request title becomes the canonical Conventional Commit on `main`
- if maintainers intentionally use a non-squash merge path, every commit message in that branch must follow the same contract
- add `!` or a `BREAKING CHANGE:` footer when the next release must be major

Supported releasing types:

- `feat` -> minor
- `fix` -> patch

Supported non-releasing types:

- `build`
- `chore`
- `ci`
- `docs`
- `refactor`
- `style`
- `test`

The workflow at `.github/workflows/validateReleaseIntent.yml` validates the pull request title first and falls back to commit-message validation when the title is not canonical.

### Current pre-migration release labels

Until the release automation migration is finished, every pull request must also carry exactly one supported release label:

- `release:none`
- `release:patch`
- `release:minor`
- `release:major`

The workflow at `.github/workflows/prReleaseChangeset.yml` turns that label into a managed `.changeset/release-pr-<number>.md` file and keeps it in sync when the pull request title, labels, or commits change.

### Release pull request and publish

Publishing uses the workflow at `.github/workflows/publish.yml`.

Publish flow:

1. Merge pull requests into `main` with their release label already set.
2. Changesets automation on `main` creates or updates the release pull request with generated version bump and changelog changes.
3. Merge the generated release pull request.
4. GitHub Actions runs `npm ci`.
5. GitHub Actions runs the publish script, which first executes `npm run release:check`.
6. After all verification gates pass, GitHub Actions publishes with `npm publish --access public`.

Required GitHub Actions setup:

- configure npm trusted publishing for this repository in npm
- allow GitHub Actions OIDC for npm publish
- keep workflow permissions `id-token: write`, `contents: write`, and `pull-requests: write`

Notes:

- Public npm packages can be published from a private GitHub repository.
- npm provenance is not supported for GitHub Actions publishes from private repositories, so this workflow intentionally does not pass `--provenance`.
- Keep npm trusted publishing configured for the repository. If trusted publishing is unavailable, use an `NPM_TOKEN`-based publish path instead of re-enabling provenance.
- The managed `release-pr-<number>.md` changeset files are automation-owned and should not be edited manually.
- Fork pull requests only support `release:none`; releasable changes must be merged from a repository branch so automation can commit the managed changeset file.

If any verification step fails, publish does not run.
