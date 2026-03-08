# {{displayName}}

Baseline npm-workspaces monorepo scaffolded by `create-lv48-app`.

## Workspaces

- `apps/web` - React + Vite product app with Tailwind CSS v4 and shadcn-ready wiring
- `apps/site` - Astro marketing site
- `apps/api` - Node + Hono API
- `packages/` - reserved workspace container for future shared packages

## Getting started

1. Install dependencies with `npm install`
2. Start the web app with `npm run dev --workspace @{{packageName}}/web`
3. Start the site with `npm run dev --workspace @{{packageName}}/site`
4. Start the API with `npm run dev --workspace @{{packageName}}/api`

The generated web app already includes a Tailwind CSS v4 baseline, `@/*` aliases, and the starter wiring needed to begin adding shadcn/ui components.
