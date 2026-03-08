# create-lv48-app

Opinionated initializer for TS-first SaaS projects.

## Release workflow

### Local pre-publish checks

Run the full release gate locally before triggering publish:

```bash
npm run release:check
```

This runs:

- `npm run typecheck`
- `npm run build`
- `npm run test`
- `npm run release:verify-pack`
- `npm run release:smoke`

### GitHub Actions publish

Publishing uses the workflow at `.github/workflows/publish.yml`.

Release trigger:

- `workflow_dispatch`

Required GitHub Actions setup:

- configure npm trusted publishing for this repository in npm
- allow GitHub Actions OIDC for npm publish
- keep workflow permission `id-token: write`

Publish flow:

1. Trigger the `Publish Package` workflow manually.
2. GitHub Actions runs `npm ci`.
3. GitHub Actions runs `npm run release:check`.
4. GitHub Actions publishes with `npm publish --access public`.

Notes:

- Public npm packages can be published from a private GitHub repository.
- npm provenance is not supported for GitHub Actions publishes from private repositories, so this workflow intentionally does not pass `--provenance`.
- Keep npm trusted publishing configured for the repository. If trusted publishing is unavailable, use an `NPM_TOKEN`-based publish path instead of re-enabling provenance.

If any verification step fails, publish does not run.
