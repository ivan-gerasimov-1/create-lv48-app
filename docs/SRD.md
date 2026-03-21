# SRD — System Requirements Document for npm Initializer / Scaffold CLI

## 1. System overview

The system is a `create-*` format CLI package designed to generate new projects from pre-built templates.

Primary invocation:

```bash
npm init lv48-app
```

or:

```bash
npx create-lv48-app
```

The CLI must:

- accept user input
- select a preset
- copy template files
- apply transformations
- execute optional post-setup steps

## 2. System goals

The system must:

- create a baseline SaaS monorepo based on npm workspaces with a single command
- support preset-based architecture
- minimize manual setup
- embed README instructions into the generated project
- serve as a foundation for further implementation via OpenSpec

## 3. High-level architecture

### 3.1 Package type

The initializer must be published as an npm package of the form:

- `create-lv48-app`

### 3.2 Runtime model

The CLI runs in a Node.js runtime and uses the local filesystem for project generation.

### 3.4 Release model

Package publishing must rely on a reproducible release pipeline: the local release-check and GitHub Actions workflow must use the same set of verification gates before `npm publish`. The automation path is fixed as: PR labels → managed changeset files → changesets release PR → npm trusted publishing via OIDC after release PR merge.

### 3.3 Internal architecture

The system must consist of the following logical layers:

- CLI entrypoint
- prompt/input layer
- preset resolver
- template copier
- variable interpolation layer
- file transform layer
- post-setup executor
- output logger / summary layer

## 4. Package structure requirements

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

It is acceptable to merge `src/presets` and `templates` if it simplifies implementation, but presets must remain an explicit entity.

The package must also include repository-level release-related assets:

- `.github/workflows/` for publish workflow
- documented release procedure

## 5. Preset model

### 5.1 Phase 1 preset support

In the first phase, the system must support the preset:

- `base`

### 5.2 Phase 2 preset support

In the second phase, support must be added for:

- `convex-realtime`

### 5.3 Preset isolation requirement

Each preset must:

- have its own template structure
- have its own metadata/rules
- have its own README assets and instructions where needed
- not depend on a chaotic matrix of feature flags

## 6. Template structure requirements

Each template must contain a complete starter monorepo.

### 6.1 Base template expected structure

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

`packages/` must exist in the scaffold as an empty directory with no marker files, reserved for future shared workspaces.

### 6.2 Template metadata requirements

`template.json` must describe at minimum:

- preset id
- preset display name
- supported package managers
- placeholder keys
- optional post-generation rules

## 7. CLI requirements

### 7.1 Invocation

The CLI must support running:

- via `npm init …`
- via `npx create-…`
- directly via the `bin` entrypoint

### 7.2 Prompts

The CLI must be able to ask:

- project name
- target directory
- install dependencies? (`yes/no`)
- initialize git? (`yes/no`)

In phase 1, the `base` preset is applied by default without a separate prompt; some values may have defaults and not be asked during non-interactive runs.

### 7.3 Non-interactive support

It is desirable to provide non-interactive mode support later, but it is not required for the first version.

### 7.4 Published artifact requirement

The published npm artifact must:

- contain a working `bin` entrypoint
- contain compiled runtime output
- contain template assets needed for scaffold generation
- not depend on files that exist only in the source repository

### 7.5 Release trigger requirement

Publishing via GitHub Actions must only be triggered from a merged release commit in `main` that was prepared by changesets automation:

- PR release intent is set by exactly one label from `release:none|patch|minor|major`
- managed changeset is generated and updated automatically at the PR level
- final publish is triggered only after the generated release PR is merged

## 8. File generation requirements

### 8.1 Copy behavior

The system must:

- copy template files recursively
- preserve directory structure
- correctly create missing directories

### 8.2 Placeholder replacement

The system must replace placeholders in template files, for example:

- `{{projectName}}`
- `{{packageName}}`
- `{{webName}}`
- `{{siteName}}`
- `{{apiName}}`

The list of placeholders must be centralized and validated.

### 8.3 Special file rename

The system must support renaming special files, for example:

- `_gitignore` → `.gitignore`
- `_npmrc` → `.npmrc`
- similar cases as needed

### 8.4 JSON transforms

The system must be able to structurally modify:

- root `package.json`
- workspace package names
- metadata fields
- workspace `package.json` scripts and names

Avoid brittle string replace where parse/write is possible.

## 9. Generated project requirements

### 9.1 Baseline output structure

The generated project in phase 1 must contain:

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

### 9.2 Baseline generated documents

Generated README files must be aligned with the generated structure and setup path.

### 9.3 Baseline stack verification

Smoke verification for phase 1 must confirm not only the presence of starter files, but also that:

- `apps/web` contains the expected Vite + React + Tailwind CSS v4 entry pattern (`index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `vite.config.ts`) and shadcn-ready wiring (`components.json`, alias config, utility helper, starter UI component)
- `apps/site` contains the expected Astro entry pattern (`astro.config.mjs`, `src/pages/index.astro`)
- `apps/api` contains the expected minimal Hono entry pattern (`src/index.ts` with Hono app bootstrap)
- `packages/` is created as an empty reserved directory with no additional files

### 9.4 Package manager assumption

Phase 1 package manager:

- `npm`

The CLI may run via npm/npx, and the output project must be designed for a monorepo based on npm workspaces.

## 10. Post-setup requirements

### 10.1 Dependency installation

If the user agrees, the CLI must execute dependency installation via `npm install`.

### 10.2 Git initialization

If the user agrees, the CLI must:

- execute `git init`
- create an initial `.gitignore` where possible
- not fail silently on git errors

### 10.3 Final summary

After generation, the CLI must print:

- what was created
- that the baseline `base` preset was applied
- that the project uses `npm`
- whether dependencies were installed
- whether git was initialized
- what commands to run next

## 11. Validation requirements

### 11.1 Name validation

The system must validate:

- project name
- npm-compatible package name
- target directory conflicts

### 11.2 Directory safety

The system must:

- warn if the directory is not empty
- allow safely aborting the process
- avoid silently overwriting files

### 11.3 Partial generation handling

If generation was interrupted, the CLI must:

- explicitly report what happened
- where possible, indicate which files had already been created
- not pretend that everything succeeded

## 12. Preset extensibility requirements

The system must be structured so that a new preset can be added via:

- a new template directory
- a new preset metadata file
- optional preset-specific transforms
- optional preset-specific README instructions

Without rewriting the entire generator.

## 13. Documentation generation requirements

The generated project must contain:

- root README
- project-level README files for generated apps and packages
- instructions aligned with the generated structure and setup path

These README assets must be versioned template assets, not just strings hardcoded in the generator.

## 14. Implementation constraints

### 14.1 Simplicity first

The first phase does not require:

- plugin system
- remote template registry
- template inheritance engine
- complex migration system for previously generated projects

### 14.2 Template-local truth

Where possible, the template must be self-contained. The generator must not assemble half the project from random string fragments scattered throughout the code.

### 14.3 Structured transforms over text hacks

Where possible, prefer:

- JSON parse/write
- metadata-driven replacement
- explicit rules

over brittle regexp hacks on large files.

## 15. Operational requirements

The system must work in a normal local development environment:

- macOS
- Linux
- Windows, where practically feasible

Minimum requirements:

- Node.js runtime
- filesystem access
- package manager commands available for optional install steps

For automated publishing, the following are also required:

- GitHub Actions runner
- npm trusted publishing via OIDC between GitHub Actions and npm

## 16. Security and trust considerations

The initializer must not:

- execute arbitrary remote code without an explicit user decision
- download templates from unknown sources in the first version
- replace dependency installation commands with opaque behavior

All post-setup actions must be explicit and expected.

The GitHub Actions publish path must not:

- publish the package without passing verification gates
- store registry credentials in the repository or as a long-lived npm token for this workflow
- execute publish from an unverified workflow path

## 17. Main technical risks

### 17.1 Template drift

README instructions and the actual template structure may begin to diverge.

### 17.2 Preset sprawl

As the number of presets grows, the generator may become difficult to maintain.

### 17.3 Over-abstraction

Premature "generator architecture" may make the code more complex than the task itself.

### 17.4 Coupling between CLI and templates

If template logic is too deeply embedded in the generator code, it will become difficult to evolve templates independently.

### 17.5 Convex preset under-modeling

If the Convex preset is made superficially, it will be architecturally dishonest.

### 17.6 Release path drift

The local release-check and GitHub Actions publish may diverge in steps and produce different results.

## 18. Recommended implementation guardrails

1. One create-package.
2. One strong `base` preset in the first version.
3. Add `convex-realtime` as a separate preset, not a flag.
4. Store templates inside the package at the start.
5. Minimize the number of required questions to the user.
6. Root and project-level READMEs must reside alongside the generated code.
7. Structural transforms are preferred over string hacks.
8. Package manager for phase 1 — `npm`.
9. Phase 1 baseline relies only on npm workspaces.
10. Errors must be clear and must not be masked.
11. The generator must create a baseline, not attempt to generate the entire world.
12. GitHub Actions publish must use the same release gates as the local release-check.

## 19. Suggested next implementation step

The next practical step after these documents:

- design the structure of the CLI repository itself
- create the `base` template with workspace manifests and starter files for `web/site/api`
- implement prompts + copy + transforms + post-setup
- verify the end-to-end `npm init …` scenario
- add release-check and GitHub Actions publish workflow for the public npm package
- after stabilization, add the `convex-realtime` preset
