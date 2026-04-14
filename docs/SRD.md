# SRD — System Requirements Document for npm Initializer / Scaffold CLI

## System Overview

`create-*` CLI package for generating new projects from pre-built templates.

Primary invocation:

```bash
npm init lv48-app
```

```bash
npx create-lv48-app
```

The CLI must:

- accept user input
- select a preset
- copy template files
- apply transformations
- execute optional post-setup steps

## System Goals

The system must:

- create a baseline SaaS monorepo based on npm workspaces with one command
- support preset-based architecture
- minimize manual setup
- embed README instructions into generated project
- serve as a foundation for OpenSpec implementation

## High-Level Architecture

### Package Type

The initializer must be published as:

- `create-lv48-app`

### Runtime Model

The CLI runs in Node.js and uses local filesystem for project generation.

### Release Model

Package publishing must rely on a reproducible release pipeline. Local release-check and GitHub Actions workflow must use same verification gates before `npm publish`.

Automation path:

`conventional commits` → `release-please` release PR → npm trusted publishing via OIDC after release PR merge

### Internal Architecture

The system must consist of these logical layers:

- CLI entrypoint
- prompt/input layer
- preset resolver
- template copier
- variable interpolation layer
- file transform layer
- post-setup executor
- output logger / summary layer

## Package Structure Requirements

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

`src/presets` and `templates` may be merged if that simplifies implementation, but presets must remain an explicit entity.

Repository-level release assets must also exist:

- `.github/workflows/` for publish workflow
- documented release procedure

## Preset Model

### Phase 1

Support preset:

- `base`

### Phase 2

Add preset:

- `convex-realtime`

### Preset Isolation

Each preset must:

- have its own template structure
- have its own metadata and rules
- have its own README assets and instructions where needed
- avoid a chaotic matrix of feature flags

## Template Structure Requirements

Each template must contain a complete starter monorepo.

### Base Template Expected Structure

```txt
templates/base/
  _meta/
    template.json
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
        index.css
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
        index.ts
  packages/
  README.md
  package.json.tpl
  _gitignore
  .env.example
```

`packages/` must exist as an empty directory with no marker files. It is reserved for future shared workspaces.

### Template Metadata Requirements

`template.json` must describe at minimum:

- preset id
- preset display name
- supported package managers
- placeholder keys
- optional post-generation rules

## CLI Requirements

### Invocation

The CLI must support running:

- via `npm init ...`
- via `npx create-...`
- directly through the `bin` entrypoint

### Prompts

The CLI must be able to ask:

- project name
- target directory
- install dependencies? (`yes/no`)
- initialize git? (`yes/no`)

In Phase 1, `base` must be the default preset without a separate prompt. Some values may default and remain unasked during non-interactive runs, if supported.

### Non-Interactive Support

Non-interactive mode is desirable later, but not required for the first version.

### Published Artifact Requirements

The published npm artifact must:

- contain a working `bin` entrypoint
- contain compiled runtime output
- contain template assets required for scaffold generation
- not depend on source-only files
- be published under `MIT`
- be verified before publish with a smoke check that confirms CLI entrypoint runs and bundled templates are accessible

### Release Trigger Requirements

Publishing via GitHub Actions must only be triggered from a merged release commit in `main` prepared by `release-please`:

- release intent is expressed via conventional commits or a merge title compatible with Conventional Commits
- `release-please` assembles the version bump and changelog in release PR
- final publish is triggered only after generated release PR is merged
- rerunning publish workflow for same merged release commit must remain possible if a previous publish failed after release PR creation

## File Generation Requirements

### Copy Behavior

The system must:

- copy template files recursively
- preserve directory structure
- create missing directories correctly

### Placeholder Replacement

The system must replace placeholders in template files, for example:

- `{{projectName}}`
- `{{packageName}}`
- `{{displayName}}`
- `{{webName}}`
- `{{siteName}}`
- `{{apiName}}`
- `{{projectUrl}}`
- `{{repositoryUrl}}`

Environment-related placeholders, such as example env values, must also be substituted where present.

The placeholder list must be centralized and validated.

### Special File Rename

The system must support renaming special files, for example:

- `_gitignore` → `.gitignore`
- `_npmrc` → `.npmrc`
- similar cases as needed

### JSON Transforms

The system must be able to structurally modify:

- root `package.json`
- workspace package names
- metadata fields
- workspace `package.json` scripts and names

Avoid brittle string replace where parse/write is possible.

## Generated Project Requirements

### Baseline Output Structure

Generated project in Phase 1 must contain:

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
      index.css
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
      index.ts

packages/

package.json
README.md
```

### Baseline Generated Documents

Generated README files must match generated structure and setup path.

### Baseline Stack Verification

Smoke verification for Phase 1 must confirm not only starter files, but also that:

- `apps/web` contains the expected Vite + React + Tailwind CSS v4 entry pattern (`index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `vite.config.ts`) and shadcn-ready wiring (`components.json`, alias config, utility helper, starter UI component)
- `apps/site` contains the expected Astro entry pattern (`astro.config.mjs`, `src/pages/index.astro`)
- `apps/api` contains the expected minimal Hono entry pattern (`src/index.ts` with Hono app bootstrap)
- `packages/` is created as an empty reserved directory with no additional files

### Package Manager Assumption

Phase 1 package manager:

- `npm`

The CLI may run via npm/npx, and the output project must be designed for a monorepo based on npm workspaces.

## Post-Setup Requirements

### Dependency Installation

If the user agrees, the CLI must execute dependency installation via `npm install`.

### Git Initialization

If the user agrees, the CLI must:

- execute `git init`
- create an initial `.gitignore` where possible
- not fail silently on git errors

### Final Summary

After generation, the CLI must print:

- what was created
- that `base` preset was applied
- that the project uses `npm`
- whether dependencies were installed
- whether git was initialized
- next commands to run

## Validation Requirements

### Name Validation

The system must validate:

- project name
- npm-compatible package name
- target directory conflicts

### Directory Safety

The system must:

- warn if directory is not empty
- allow safely aborting the process
- avoid silently overwriting files

### Partial Generation Handling

If generation was interrupted, the CLI must:

- explicitly report what happened
- indicate which files were already created, where possible
- not pretend everything succeeded
- roll back partial output where feasible, otherwise honestly report partial state

## Preset Extensibility Requirements

The system must be structured so a new preset can be added via:

- a new template directory
- a new preset metadata file
- optional preset-specific transforms
- optional preset-specific README instructions

No full generator rewrite should be needed.

## Documentation Generation Requirements

Generated project must contain:

- root README
- project-level README files for generated apps and packages
- instructions aligned with generated structure and setup path

These README assets must be versioned template assets, not strings hardcoded in generator.

## Implementation Constraints

### Simplicity First

Phase 1 does not require:

- plugin system
- remote template registry
- template inheritance engine
- complex migration system for previously generated projects

### Template-Local Truth

Where possible, the template must be self-contained. The generator must not assemble half the project from random string fragments scattered through code.

### Structured Transforms Over Text Hacks

Where possible, prefer:

- JSON parse/write
- metadata-driven replacement
- explicit rules

over brittle regexp hacks on large files.

## Operational Requirements

The system must work in a normal local development environment:

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

## Security and Trust Considerations

The initializer must not:

- execute arbitrary remote code without explicit user decision
- download templates from unknown sources in the first version
- replace dependency installation commands with opaque behavior

All post-setup actions must be explicit and expected.

The GitHub Actions publish path must not:

- publish the package without passing verification gates
- store registry credentials in the repository or as a long-lived npm token for this workflow
- execute publish from an unverified workflow path

## Main Technical Risks

### Template Drift

README instructions and actual template structure may diverge.

### Preset Sprawl

As presets grow, the generator may become difficult to maintain.

### Over-Abstraction

Premature generator architecture may make the code more complex than the task.

### Coupling Between CLI and Templates

If template logic is too deeply embedded in generator code, template evolution becomes hard.

### Convex Preset Under-Modeling

If the Convex preset is made superficially, it will be architecturally dishonest.

### Release Path Drift

Local release-check and GitHub Actions publish may diverge in steps and produce different results.

### Demo-Template Appearance

Generated project may look like a toy demo instead of a production-ready baseline.

### Packaging Drift on First Release

First public npm publish may break if packed artifact misses required runtime output or template assets, or if the bin entrypoint is misconfigured.

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
