# {{displayName}}

Baseline npm-workspaces monorepo scaffolded by `create-lv48-app`.

## Workspaces

- `apps/web` - React + Vite product app
- `apps/site` - Astro marketing site
- `apps/api` - Node + Hono API
- `packages/config` - shared config defaults
- `packages/ui` - shared UI exports
- `packages/types` - shared domain types
- `packages/utils` - shared utilities

## Getting started

1. Install dependencies with `npm install`
2. Start the web app with `npm run dev --workspace @{{packageName}}/web`
3. Start the site with `npm run dev --workspace @{{packageName}}/site`
4. Start the API with `npm run dev --workspace @{{packageName}}/api`
