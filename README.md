# Create LV48 App

> Generated with AI. Human verification is not the default assumption.

## What Is This?

`create-lv48-app` is an opinionated initializer for TS-first SaaS projects.

It creates an npm workspaces monorepo with:

- React + Vite + Tailwind CSS v4 web app, shadcn-ready
- Astro site
- Node + Hono API
- reserved `packages/` workspace area for shared packages

## Requirements

- Node.js 24 or newer
- npm

## Quick Start

```bash
npm init lv48-app
```

```bash
npx create-lv48-app
```

## What It Asks

The initializer prompts for:

- project name
- target directory
- workspace layout: single or multi
- first app project name, only for multi layout
- whether to install dependencies
- whether to initialize git

`base` preset is applied by default. Package manager is `npm`.

## What It Creates

> Shared packages always use `@<rootPackage>/<packageFolder>` regardless of layout.

### Single-Project Layout

```txt
<project>/
├── apps/
│   ├── web/
│   ├── site/
│   └── api/
├── packages/
└── package.json
```

Root workspaces: `["apps/*", "packages/*"]`

App packages: `@<rootPackage>/web`, `@<rootPackage>/site`, `@<rootPackage>/api`

### Multi-Project Layout

```txt
<project>/
├── apps/
│   └── <appProjectName>/
│       ├── web/
│       ├── site/
│       └── api/
├── packages/
└── package.json
```

Root workspaces: `["apps/*/*", "packages/*"]`

App packages: `@<appProjectName>/web`, `@<appProjectName>/site`, `@<appProjectName>/api`

## Docs

- [Development](./docs/development.md)
- [Release](./docs/release.md)
- [Product requirements](./docs/PRD.md)
- [System requirements](./docs/SRD.md)
- [Architectural decision log](./docs/ADL.md)
- [Engineering conventions](./docs/engineering-conventions.md)
