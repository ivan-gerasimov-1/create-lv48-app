# Create LV48 App

> Generated with AI. Human verification is not the default assumption.

Opinionated initializer for TS-first SaaS projects.

## Requirements

- Node.js 24 or newer
- npm

## Usage

```bash
npm init lv48-app
```

```bash
npx create-lv48-app
```

The initializer prompts for:

- project name
- target directory
- install dependencies
- initialize git

`base` preset is applied by default. Package manager is `npm`.

## Scaffold

The `base` preset generates an npm workspaces monorepo:

```txt
<project>/
├── apps/
│   ├── web/     # React + Vite + Tailwind CSS v4, shadcn-ready
│   ├── site/    # Astro
│   └── api/     # Node + Hono
├── packages/    # reserved for future shared workspaces
└── package.json # root workspace manifest
```

Generated package manifests set `engines.node` to `>=24.0.0`.

If git init is selected, the repository starts on `main`.

## Development

Run tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Tests use built-in `node:test`.

## Release

### Local Check

Run the full release gate locally:

```bash
npm run release:check
```

This runs:

- `npm run typecheck`
- `npm run build`
- `npm run test`
- `npm run release:verify-pack`
- `npm run release:smoke`

### Release Intent

Release intent MUST stay compatible with `release-please`.

Rules:

- use Conventional Commit metadata on merges to `main`
- prefer squash merge so PR title becomes canonical commit message
- if not using squash merge, every commit on branch MUST follow same contract
- use `!` or `BREAKING CHANGE:` for major release intent

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

`validateReleaseIntent.yml` checks PR title first, then commit messages when title is not canonical.

### Publish Flow

Publishing uses `.github/workflows/publish.yml`.

Flow:

1. Merge changes to `main` with Conventional Commit metadata.
2. `release-please` creates or updates release PR.
3. Merge generated release PR.
4. Merged release commit on `main` triggers publish.
5. GitHub Actions runs `npm ci`.
6. GitHub Actions runs `npm run release:publish`, which starts with `npm run release:check`.
7. After all gates pass, GitHub Actions publishes with `npm publish --access public`.

GitHub Actions setup:

- configure npm trusted publishing for this repository
- allow GitHub Actions OIDC for npm publish
- keep workflow permissions `id-token: write`, `contents: write`, and `pull-requests: write`

Notes:

- Public npm packages can be published from a private GitHub repository.
- npm provenance is not supported for GitHub Actions publishes from private repositories, so this workflow does not pass `--provenance`.
- If trusted publishing is unavailable, use `NPM_TOKEN` publish path instead of re-enabling provenance.
- Generated release PR is the only automation-owned release artifact in repository.
- Re-running publish for same merged release commit remains valid if previous attempt failed after release PR was created.

If any verification step fails, publish does not run.
