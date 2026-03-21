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

Supported release types:

- `feat` -> minor
- `fix` -> patch

Non-release types:

- `build`
- `chore`
- `ci`
- `docs`
- `refactor`
- `style`
- `test`

The workflow at `.github/workflows/validateReleaseIntent.yml` validates the pull request title first and falls back to commit-message validation when the title is not canonical.

### Release pull request and publish

Publishing uses the workflow at `.github/workflows/publish.yml`.

Publish flow:

1. Merge pull requests into `main` with Conventional Commit metadata that `release-please` can interpret.
2. `release-please` on `main` creates or updates the generated release pull request with version bump and changelog changes.
3. Merge the generated release pull request.
4. The merged release commit on `main` triggers GitHub Actions publish.
5. GitHub Actions runs `npm ci`.
6. GitHub Actions runs `npm run release:publish`, which first executes `npm run release:check`.
7. After all verification gates pass, GitHub Actions publishes with `npm publish --access public`.

Required GitHub Actions setup:

- configure npm trusted publishing for this repository in npm
- allow GitHub Actions OIDC for npm publish
- keep workflow permissions `id-token: write`, `contents: write`, and `pull-requests: write`

Notes:

- Public npm packages can be published from a private GitHub repository.
- npm provenance is not supported for GitHub Actions publishes from private repositories, so this workflow intentionally does not pass `--provenance`.
- Keep npm trusted publishing configured for the repository. If trusted publishing is unavailable, use an `NPM_TOKEN`-based publish path instead of re-enabling provenance.
- The generated release pull request is the only automation-owned release artifact in the repository.
- Re-running publish for the same merged release commit remains valid if a previous attempt failed after the release PR was created.

If any verification step fails, publish does not run.
