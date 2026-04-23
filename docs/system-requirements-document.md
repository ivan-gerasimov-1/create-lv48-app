# System Requirements Document for npm Initializer / Scaffold CLI

## Overview

`create-*` CLI package for generating new projects from pre-built templates.

Invocation:

```bash
npm init lv48-app
```

```bash
npx create-lv48-app
```

The CLI MUST:

- accept user input
- select a preset
- copy template files
- apply transformations
- execute optional post-setup steps

## Goals

The system MUST:

- create baseline SaaS monorepo based on npm workspaces with one command
- support preset-based architecture
- minimize manual setup
- embed README instructions into generated project
- serve as a foundation for OpenSpec implementation

## Architecture

### Package Type

The initializer MUST be published as:

- `create-lv48-app`

### Runtime Model

The CLI runs in Node.js and uses local filesystem for project generation.

### Release Model

Package publishing MUST rely on a reproducible release pipeline. Local release-check and GitHub Actions workflow MUST use same verification gates before `npm publish`.

Automation path:

`conventional commits` → `release-please` release PR → npm trusted publishing via OIDC after release PR merge

### Internal Layers

- CLI entrypoint
- prompt/input layer
- preset resolver
- template copier
- variable interpolation layer
- file transform layer
- post-setup executor
- output logger / summary layer

## Package Structure

Recommended structure:

```txt
create-lv48-app/
  package.json
  bin/
    create-lv48-app.js
  src/
    cli.ts
    prompts.ts
    generate.ts
    presets/
      base/
      convex-realtime/
    transforms/
      packageJson.ts
      placeholders.ts
      renameSpecialFiles.ts
      env.ts
    utils/
      fs.ts
      validation.ts
      logging.ts
  templates/
    base/
    convex-realtime/
  README.md
```

`src/presets` and `templates` may be merged if that simplifies implementation, but presets MUST remain explicit.

Repository-level release assets MUST also exist:

- `.github/workflows/` for publish workflow
- documented release procedure

## Presets

### Phase 1

Support preset:

- `base`

### Phase 2

Add preset:

- `convex-realtime`

### Isolation

Each preset MUST:

- have its own template structure
- have its own metadata and rules
- have its own README assets and instructions where needed
- avoid a chaotic matrix of feature flags

## Template Structure

Each template MUST contain a complete starter monorepo.

### Base Template Structure

```txt
templates/base/
  template.ts
  files/
    apps/
      web/
        components.json
        package.json
        README.md
        index.html
        tsconfig.json
        vite.config.ts
        src/
          App.tsx
          components/
            ui/
              button.tsx
          global.css
          lib/
            utils.ts
          main.tsx
      site/
        package.json
        README.md
        astro.config.mjs
        src/
          pages/
            index.astro
      api/
        package.json
        README.md
        src/
          app.ts
    packages/
    README.md
    package.json.tpl
    _gitignore
    .env.example
```

`templates/base/files/packages/` MUST exist as empty directory with no marker files. It is reserved for future shared workspaces.

### Template Metadata

`template.ts` MUST be the typed source of truth for template metadata and MUST describe at minimum:

- preset id
- preset display name
- supported package managers
- placeholder keys
- optional post-generation rules

`template.ts` MUST provide `rootDir: import.meta.url`. Generated template assets MUST live in the sibling `files` directory.

Template metadata MUST NOT contain `templateDirectory` or `templateRoot`; the generator derives the copied asset root from the fixed `files` convention.

## CLI Requirements

### Invocation

The CLI MUST support:

- `npm init ...`
- `npx create-...`
- direct `bin` entrypoint

### Prompts

The CLI MUST be able to ask:

- project name
- target directory
- install dependencies? (`yes/no`)
- initialize git? (`yes/no`)

In Phase 1, `base` MUST be default preset without a separate prompt. Some values may default and remain unasked during non-interactive runs, if supported.

### Non-Interactive Support

Non-interactive mode is desirable later, but not required for the first version.

### Published Artifact

The published npm artifact MUST:

- contain a working `bin` entrypoint
- contain compiled runtime output
- contain template assets required for scaffold generation
- not depend on source-only files
- be published under `MIT`
- be verified before publish with a smoke check that confirms CLI entrypoint runs and bundled templates are accessible

### Release Trigger

Publishing via GitHub Actions MUST only be triggered from a merged release commit in `main` prepared by `release-please`:

- release intent is expressed via conventional commits or a merge title compatible with Conventional Commits
- `release-please` assembles the version bump and changelog in release PR
- final publish is triggered only after generated release PR is merged
- rerunning publish workflow for same merged release commit MUST remain possible if a previous publish failed after release PR creation

## File Generation

### Copy Behavior

The system MUST:

- copy template files recursively
- preserve directory structure
- create missing directories correctly

### Placeholder Replacement

The system MUST replace placeholders in template files, for example:

- `{{projectName}}`
- `{{packageName}}`
- `{{displayName}}`
- `{{webName}}`
- `{{siteName}}`
- `{{apiName}}`
- `{{projectUrl}}`
- `{{repositoryUrl}}`

Environment-related placeholders, such as example env values, MUST also be substituted where present.

The placeholder list MUST be centralized and validated.

### Special File Rename

The system MUST support renaming special files, for example:

- `_gitignore` → `.gitignore`
- `_npmrc` → `.npmrc`
- similar cases as needed

### JSON Transforms

The system MUST be able to structurally modify:

- root `package.json`
- workspace package names
- metadata fields
- workspace `package.json` scripts and names

Avoid brittle string replace where parse/write is possible.

## Generated Project

### Baseline Output

Generated project in Phase 1 MUST contain:

```txt
apps/
  web/
    components.json
    package.json
    README.md
    index.html
    tsconfig.json
    vite.config.ts
    src/
      App.tsx
      components/
        ui/
          button.tsx
      global.css
      lib/
        utils.ts
      main.tsx
  site/
    package.json
    README.md
    astro.config.mjs
    src/
      pages/
        index.astro
  api/
    package.json
    README.md
    src/
      app.ts

packages/

package.json
README.md
```

### Generated Documents

Generated README files MUST match generated structure and setup path.

### Stack Verification

Smoke verification for Phase 1 MUST confirm not only starter files, but also that:

- `apps/web` contains the expected Vite + React + Tailwind CSS v4 entry pattern (`index.html`, `src/main.tsx`, `src/App.tsx`, `src/global.css`, `vite.config.ts`) and shadcn-ready wiring (`components.json`, alias config, utility helper, starter UI component)
- `apps/site` contains the expected Astro entry pattern (`astro.config.mjs`, `src/pages/index.astro`)
- `apps/api` contains the expected minimal Hono entry pattern (`src/app.ts` with Hono app bootstrap)
- `packages/` is created as empty reserved directory with no additional files

### Package Manager

Phase 1 package manager:

- `npm`

The CLI may run via npm/npx, and the output project MUST be designed for a monorepo based on npm workspaces.

## Post-Setup

### Dependency Installation

If the user agrees, the CLI MUST execute dependency installation via `npm install`.

### Git Initialization

If the user agrees, the CLI MUST:

- execute `git init`
- create an initial `.gitignore` where possible
- not fail silently on git errors

### Final Summary

After generation, the CLI MUST print:

- what was created
- that `base` preset was applied
- that the project uses `npm`
- whether dependencies were installed
- whether git was initialized
- next commands to run

## Validation

### Name Validation

The system MUST validate:

- project name
- npm-compatible package name
- target directory conflicts

### Directory Safety

The system MUST:

- warn if directory is not empty
- allow safely aborting the process
- avoid silently overwriting files

### Partial Generation

If generation was interrupted, the CLI MUST:

- explicitly report what happened
- indicate which files were already created, where possible
- not pretend everything succeeded
- roll back partial output where feasible, otherwise honestly report partial state

## Extensibility

The system MUST be structured so a new preset can be added via:

- a new template directory
- a typed `template.ts` metadata definition
- generated assets in the template's `files` directory
- optional preset-specific transforms
- optional preset-specific README instructions

No full generator rewrite should be needed.

## Documentation

Generated project MUST contain:

- root README
- project-level README files for generated apps and packages
- instructions aligned with generated structure and setup path

These README assets MUST be versioned template assets, not strings hardcoded in generator.

## Implementation Constraints

### Simplicity First

Phase 1 does not require:

- plugin system
- remote template registry
- template inheritance engine
- complex migration system for previously generated projects

### Template-Local Truth

Where possible, the template MUST be self-contained. The generator MUST not assemble half the project from random string fragments scattered through code.

### Structured Transforms Over Text Hacks

Where possible, prefer:

- JSON parse/write
- typed metadata-driven replacement
- explicit rules

over brittle regexp hacks on large files.

## Operational Requirements

The system MUST work in a normal local development environment:

- macOS
- Linux
- Windows, where practical

Minimum requirements:

- Node.js runtime
- filesystem access
- package manager commands available for optional install steps

For automated publishing, these are also required:

- GitHub Actions runner
- npm trusted publishing via OIDC between GitHub Actions and npm

## Security and Trust

The initializer MUST not:

- execute arbitrary remote code without explicit user decision
- download templates from unknown sources in the first version
- replace dependency installation commands with opaque behavior

All post-setup actions MUST be explicit and expected.

The GitHub Actions publish path MUST not:

- publish the package without passing verification gates
- store registry credentials in the repository or as a long-lived npm token for this workflow
- execute publish from an unverified workflow path

## Risks

- Template drift: README instructions and actual template structure may diverge.
- Preset sprawl: as presets grow, the generator may become difficult to maintain.
- Over-abstraction: premature generator architecture may make the code more complex than the task.
- Coupling between CLI and templates: template evolution becomes hard if logic is too embedded.
- Convex preset under-modeling: a superficial preset would be architecturally dishonest.
- Release path drift: local release-check and GitHub Actions publish may diverge.
- Demo-template appearance: generated project may look like a toy demo instead of a baseline.
- Packaging drift on first release: packed artifact may miss runtime output or template assets, or misconfigure `bin`.

## Guardrails

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
