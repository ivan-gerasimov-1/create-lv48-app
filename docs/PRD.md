# PRD — npm Template Initializer for TS-first SaaS

## Product Overview

CLI initializer for creating a new project from a predefined architecture with one command.

Invocation examples:

```bash
npm init lv48-app
```

```bash
npx create-lv48-app
```

If final command name changes, this document still applies. Only package naming and invocation syntax change.

Phase 1 baseline:

- `web` - React + Vite + Tailwind CSS v4 + shadcn-ready baseline
- `site` - Astro public site
- `api` - Node + Hono backend
- `packages/` - empty reserved directory for future shared workspaces
- root README and app-level READMEs with setup instructions

Phase 2 adds a separate preset for Convex / realtime-first apps.

## Problem Statement

Starting a new project now means repeating the same setup work:

- create monorepo
- configure npm workspaces
- lay out `web` / `site` / `api`
- copy shared config files
- copy architectural docs
- repeat conventions
- align structure to chosen architecture

That slows project start, adds noise, and increases early structural mistakes.

## Product Goals

The initializer must:

- create a project with one command
- provide a stable architectural baseline
- reduce manual setup
- encode architectural decisions in scaffold
- prepare foundation for OpenSpec implementation
- support new presets without breaking base path

## Non-Goals

Phase 1 must not:

- generate production-ready business logic
- cover every possible architecture variant
- become a universal low-code builder
- support lots of incompatible flags
- ship a plugin ecosystem
- perform full cloud provisioning
- auto-deploy the project
- replace proper domain model design

## Target Users

### Primary User

Developer or product engineer who:

- starts new SaaS projects often
- wants one architectural baseline
- prefers TypeScript-first stack
- wants one-command scaffold
- continues work via OpenSpec pipeline

### Secondary User

Team that:

- wants to standardize project start
- wants less manual setup
- wants architectural rules fixed in template

## Core Product Principles

- Scaffold, not magic.
- Opinionated baseline.
- One happy path first.
- Architecture encoded in files.
- Presets over toggle explosion.

## Product Scope

### Phase 1

The initializer must:

- create project from baseline preset
- work as `npm init ...` and `npx create-...`
- ask for minimum necessary info
- generate npm-workspaces monorepo
- copy template files
- substitute project-specific values
- generate root README and app READMEs
- optionally install dependencies
- optionally run `git init`
- print clear next steps
- publish as public npm package under `MIT`
- keep release checks reproducible
- use GitHub Actions release PR flow with `release-please` and trusted publishing after verification gates pass

### Phase 2

The initializer must support one more preset:

- `convex-realtime`

This preset must be a separate architectural branch, not a single extra library on top of base.

### Out of Scope for Phase 1

- remote template downloads from arbitrary repos
- web UI for generation
- template marketplace
- enterprise account features
- telemetry platform
- deep infrastructure provisioning
- cloud auto-deploy out of the box

## User Experience

### Main Flow

1. Select or confirm project name.
2. Select target directory.
3. Decide whether to install dependencies.
4. Decide whether to run `git init`.
5. Receive generated project.
6. Receive summary and next steps.

### Default Phase 1 Flow

- project name
- preset = `base` by default, with no separate prompt
- package manager = `npm`
- install dependencies = optional
- git init = optional

## Functional Requirements

### CLI Entrypoint

The system must:

- run via `npm init <name>`
- run via `npx create-<name>`
- expose a clear `bin` entrypoint
- support running in an empty directory or creating a new directory

### Template Generation

The system must:

- copy the baseline template
- support placeholder replacement
- rename special files correctly, such as `_gitignore` → `.gitignore`
- update `package.json` correctly
- generate workspace config from root `package.json` with `workspaces`

### Presets

The system must:

- support at least one preset in Phase 1: `base`
- be structured so `convex-realtime` can be added later
- avoid one large `if/else` combinator for all architectures

### Project Metadata Interpolation

The system must substitute:

- project name
- package names
- display name
- placeholder URLs / domains
- env values / examples
- repository metadata where appropriate

### Generated Architecture

Phase 1 scaffold must include:

- `apps/web`
- `apps/site`
- `apps/api`
- empty reserved `packages/` directory for future shared workspaces
- root `package.json` and package manifests for each app
- starter files for React + Vite + Tailwind CSS v4 + shadcn-ready wiring, Astro, and Node + Hono

### Generated Documentation

The initializer must generate or copy:

- root `README.md`
- `README.md` inside generated applications

### Post-Generation Actions

The initializer must be able to:

- install dependencies at user choice
- initialize git at user choice
- print final getting-started commands

### Error Handling

The system must:

- handle directory conflicts gracefully
- validate project name / package name
- explain errors in clear language
- roll back or honestly report partial generation

### Package Release and Distribution

The initializer delivery system must:

- publish `create-lv48-app` as public npm package
- include correct registry-facing metadata, including `MIT`
- verify release tarball before publishing
- confirm packed artifact runs CLI and can access bundled templates
- support `release-please`-driven GitHub Actions release PR flow
- publish only after successful release checks

## Preset Strategy

### Base Preset

Baseline SaaS project with:

- React + Vite product web app with Tailwind CSS v4 and shadcn-ready baseline
- Astro public site
- Node backend
- empty reserved `packages/` container for future shared packages
- root README and project-level READMEs with instructions for apps

### Future `convex-realtime` Preset

Separate preset for realtime-first scenarios.

This preset may change:

- data layer assumptions
- backend responsibilities
- auth integration shape
- generated README instructions
- runtime structure

It must not be a checkbox on top of base if it is architecturally a different foundation.

## Non-Functional Requirements

### Maintainability

The initializer must be:

- easy to maintain
- clear in structure
- free of unnecessary abstraction
- extensible through presets without pain

### Predictability

Same input must produce predictable output.

### Versioning Clarity

CLI version and generated template output version must be transparently linked.

### Release Safety

Publish path must be:

- reproducible
- verifiable before publish
- identical in release gates locally and in GitHub Actions

### Developer Experience

Usage experience must be:

- fast
- clear
- without unnecessary questions
- without architectural mess after generation

## Risks

Main risks:

- initializer becomes too universal and complex
- presets start leaking into each other
- template drift between README instructions and actual files
- generated project looks too much like a demo template
- CLI becomes hard to update alongside templates
- `convex-realtime` is treated as a weak variant instead of separate architecture
- first public npm release breaks because of packaging drift
- GitHub Actions release path diverges from local check

## Success Criteria

The product is successful if:

- a new project is created with one command
- baseline project is ready for work without manual reconstruction
- generated files reflect architectural rules
- generated README instructions match generated structure
- adding a second preset does not break the first
- work can move straight into OpenSpec and implementation
- npm package publishes with correct tarball and working entrypoint
- GitHub Actions publish never bypasses mandatory release checks

## Recommended Implementation Guardrails

1. One create-package.
2. One strong `base` preset in first version.
3. Add `convex-realtime` as separate preset, not a flag.
4. Store templates inside package at start.
5. Minimize number of required user questions.
6. Root and project-level READMEs must live alongside generated code.
7. Structural transforms are preferred over string hacks.
8. Phase 1 package manager is `npm`.
9. Phase 1 baseline relies only on npm workspaces.
10. Errors must be clear and not masked.
11. Generator must create a baseline, not attempt to generate everything.
12. GitHub Actions publish must use same release gates as local release-check.

## Suggested Next Implementation Step

The next practical step after these documents:

- design the CLI repository structure itself
- create the `base` template with workspace manifests and starter files for `web/site/api`
- implement prompts, copy, transforms, and post-setup
- verify the end-to-end `npm init ...` scenario
- add release-check and GitHub Actions publish workflow for the public npm package
- after stabilization, add the `convex-realtime` preset
