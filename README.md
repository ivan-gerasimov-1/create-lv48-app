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
4. GitHub Actions publishes with `npm publish --provenance --access public`.

If any verification step fails, publish does not run.
