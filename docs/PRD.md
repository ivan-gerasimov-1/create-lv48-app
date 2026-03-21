# PRD — npm Template Initializer for TS-first SaaS

## 1. Product overview

The product is an npm initializer / scaffolding CLI that lets you create a new project based on a pre-defined architecture with a single command.

Target UX examples:

```bash
npm init lv48-app
```

or

```bash
npx create-lv48-app
```

If the final command name differs, the documents remain valid — only the initializer package naming and invocation syntax change.

In the first phase, the initializer must create a baseline project for TS-first SaaS:

- `web` — product web app on React + Vite with Tailwind CSS v4 and shadcn-ready baseline
- `site` — public site on Astro
- `api` — backend on Node + Hono
- an empty reserved `packages/` directory for future shared workspaces
- root README and READMEs inside generated apps with instructions

In the next phase, a separate preset for Convex / realtime-first applications must be added.

## 2. Problem statement

Currently, starting a new project requires manually assembling the same things every time:

- creating a monorepo
- configuring the monorepo based on npm workspaces
- laying out `web` / `site` / `api`
- copying shared config files
- copying architectural documents
- repeating the same conventions
- manually aligning the structure to the chosen architecture

This slows down the start, creates noise, and increases the chance of early structural mistakes.

## 3. Product goals

The initializer must:

- allow creating a new project with a single command
- provide a stable architectural baseline
- reduce the volume of manual setup
- encode architectural decisions directly in the scaffold
- prepare the foundation for further implementation via OpenSpec
- support extension through presets without breaking the base path

## 4. Non-goals

In the first phase, the initializer must not:

- generate production-ready business functionality
- cover all possible architectural variants
- become a universal low-code builder
- support dozens of incompatible flags
- have a plugin ecosystem
- perform full cloud provisioning
- automatically deploy the project
- replace proper domain model design

## 5. Target users

### 5.1 Primary user

A developer or product engineer who:

- regularly starts new SaaS projects
- wants a unified architectural baseline
- prefers a TypeScript-first stack
- wants to run the scaffold with a single command
- wants to continue working via OpenSpec pipeline afterwards

### 5.2 Secondary user

A team that:

- wants to standardize the start of new projects
- wants to reduce manual setup
- wants to fix architectural rules directly in the template

## 6. Core product principles

### 6.1 Scaffold, not magic

The initializer must create a transparent project, not hide the structure behind generator magic.

### 6.2 Opinionated baseline

The product must be intentionally opinionated, rather than trying to please everyone.

### 6.3 One happy path first

First — one strong baseline path. Extension — only after the core is stable.

### 6.4 Architecture encoded in files

Architectural decisions must be embedded in the generated structure, README instructions, and config — not live only in the author's head.

### 6.5 Presets over toggle explosion

New architectural variants must be added as presets, not as an endless matrix of flags.

## 7. Product scope

### 7.1 In scope for phase 1

The initializer must:

- create a project from the baseline preset
- work as `npm init …` and `npx create-…`
- ask for the minimum necessary information
- generate a monorepo based on npm workspaces
- copy template files
- substitute project-specific values
- generate a root README and project-level READMEs for apps
- optionally install dependencies
- optionally execute `git init`
- print clear next steps
- be published as a public npm package under the `MIT` license with a reproducible release check
- have a GitHub Actions-based release path via a `release-please` release PR and trusted publishing after verification gates pass

### 7.2 In scope for phase 2

The initializer must support a second preset:

- `convex-realtime`

This preset must represent a separate architectural branch, not just add one library on top of base.

### 7.3 Out of scope for phase 1

- remote downloading of templates from arbitrary repositories
- web UI for project generation
- template marketplace
- enterprise account features
- telemetry platform
- deep infrastructure provisioning
- auto-deploy to cloud out of the box

## 8. User experience

### 8.1 Main flow

The user runs the command and goes through a short scenario:

1. selects or confirms the project name
2. selects the directory
3. decides whether to install dependencies
4. decides whether to run `git init`
5. receives the generated project
6. receives a summary and next steps

### 8.2 Phase 1 expected default flow

Minimal baseline flow:

- project name
- preset = `base` by default with no separate prompt
- package manager = `npm`
- install dependencies = optional
- git init = optional

## 9. Functional requirements

### 9.1 CLI entrypoint

The system must:

- run via `npm init <name>`
- run via `npx create-<name>`
- have a clear `bin` entrypoint
- support running in an empty directory or creating a new directory

### 9.2 Template generation

The system must:

- be able to copy the baseline template
- support placeholder replacement
- correctly rename special files (`_gitignore` → `.gitignore` and similar)
- correctly update `package.json`
- generate workspace configuration based on root `package.json` with `workspaces`

### 9.3 Presets

The system must:

- support at least one preset in phase 1: `base`
- be designed so that `convex-realtime` can be added later
- not mix different architectures into one large if/else combinator

### 9.4 Project metadata interpolation

The system must substitute:

- project name
- package names
- display name
- placeholder URLs / domains
- env values / examples
- repository metadata where appropriate

### 9.5 Generated architecture

Phase 1 scaffold must include:

- `apps/web`
- `apps/site`
- `apps/api`
- an empty reserved `packages/` directory for future shared workspaces
- `package.json` for the root workspace and each app
- minimal starter files for `React + Vite + Tailwind CSS v4` with shadcn-ready wiring, `Astro`, and `Node + Hono`

### 9.6 Generated documentation

The initializer must generate or copy into the project:

- `README.md`
- `README.md` inside the generated applications

### 9.7 Post-generation actions

The initializer must be able to:

- install dependencies at the user's choice
- initialize git at the user's choice
- print final commands for getting started

### 9.8 Error handling

The system must:

- gracefully handle directory conflicts
- validate project name / package name
- explain errors in clear language
- roll back the process or honestly report partially completed generation

### 9.9 Package release and distribution

The initializer delivery system must:

- publish `create-lv48-app` as a public npm package
- contain correct package metadata for registry-facing use, including the `MIT` license
- verify the release tarball before publishing
- confirm that the packed artifact actually runs the CLI and can see runtime templates
- support a `release-please`-driven GitHub Actions workflow that builds a release PR from conventional commits, makes this PR the single review point for the release diff, and publishes the package only after successful release checks

## 10. Preset strategy

### 10.1 Base preset

Baseline SaaS project with the architecture:

- React + Vite product web app with Tailwind CSS v4 and shadcn-ready baseline
- Astro public site
- Node backend
- empty reserved `packages/` container for future shared packages
- root README and project-level READMEs with instructions for apps

### 10.2 Future Convex preset

A separate preset for realtime-first scenarios.

This preset may change:

- data layer assumptions
- backend responsibilities
- auth integration shape
- generated README instructions
- runtime structure

The Convex preset must not be a "checkbox on top" of base if it is architecturally a different foundation.

## 11. Non-functional requirements

### 11.1 Maintainability

The initializer must be:

- easy to maintain
- clear in structure
- not overloaded with unnecessary abstraction
- extensible through presets without pain

### 11.2 Predictability

The same input must produce predictable output.

### 11.3 Versioning clarity

The CLI version and the generated template output version must be sufficiently transparently linked.

### 11.5 Release safety

The publish path must be:

- reproducible
- verifiable before actual publish
- identical in release gates locally and in GitHub Actions

### 11.4 Developer experience

The usage experience must be:

- fast
- clear
- without unnecessary questions
- without architectural mess after generation

## 12. Risks

Main risks:

- the initializer becomes too universal and complex
- presets start leaking into each other
- template drift between README instructions and actual files
- the generated project looks too "demo-template"
- the CLI becomes difficult to update alongside templates
- the Convex preset is undervalued as a separate architecture
- the first public npm release may be broken due to packaging drift
- the GitHub Actions release path may diverge from the local check

## 13. Success criteria

The product can be considered successful if:

- a new project is created with a single command
- the baseline project is ready for further work without manually reconstructing the structure
- generated files reflect architectural rules
- generated README instructions match the generated structure
- adding a second preset does not break the first
- after generation, work can immediately proceed to the OpenSpec phase and implementation
- the npm package is published with a correct tarball and working entrypoint
- GitHub Actions publish does not bypass the mandatory release checks
