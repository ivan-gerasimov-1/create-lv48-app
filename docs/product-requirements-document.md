# Product Requirements Document

## LV48 CLI Initializer

### 1. Context and Motivation

Starting a new project usually means repeating the same setup: monorepo, workspaces, app boundaries, configs. This work is mechanical but often inconsistent, especially across multiple projects.

The purpose of this tool is to remove that repetition by providing a consistent starting point. Instead of rebuilding structure each time, developers begin from a predefined architectural baseline.

---

### 2. Product Definition

LV48 CLI is a command-line initializer that generates a project from a predefined architectural preset.

It does not generate business logic or adapt to every use case. Its role is to provide a stable, opinionated foundation.

The output is a working monorepo with aligned tooling and documentation, ready for development.

---

### 3. Target Users

Primary users are engineers who frequently start projects and prefer a consistent architecture.

Secondary users are teams that want to standardize project structure and reduce setup variability.

---

### 4. Product Goals

The CLI should reduce the cost of starting a project and increase structural consistency.

A project must be created with a single command and be ready for work immediately.

The system should remain predictable and grow via separate presets, not configuration flags.

---

### 5. Non-Goals

The CLI is not a universal generator and does not support arbitrary architectures.

It does not generate domain logic or replace architectural design decisions.

Infrastructure setup and deployment are explicitly out of scope.

---

### 6. Product Behavior

The CLI runs via `npm init lv48-app` or `npx create-lv48-app`.

It collects minimal input (project name, directory, optional setup steps), then generates a project from a local template.

It replaces placeholders, configures workspaces, and prepares application manifests. Optional steps include installing dependencies and initializing git.

Errors must be explicit and leave no ambiguity about the result.

---

### 7. Generated Architecture

The generated project is a monorepo with three applications: web, site, and api, plus an empty packages directory.

Each app includes a minimal working setup aligned with the chosen stack (React/Vite, Astro, Node/Hono).

Root and app-level READMEs are included and must match the structure.

---

### 8. Preset Strategy

The system is based on presets, where each preset represents a full architectural choice.

The initial version includes only a base preset.

Future presets (e.g. convex-realtime) must be separate architectures, not extensions of the base.

---

### 9. System Constraints

The system should remain simple and predictable.

Templates are stored locally to ensure reproducibility. Transformations should be structural rather than string-based.

User input should be minimal, and npm workspaces are used as the default foundation.

---

### 10. Release and Distribution

The CLI is published as a public npm package under MIT.

Releases are managed via GitHub Actions and release-please. The package must be validated before publishing.

The CI release flow must match local validation to avoid inconsistencies.

---

### 11. Risks and Trade-offs

The main risk is overengineering the tool into a flexible but complex generator.

Another risk is preset leakage, where architectures become mixed or unclear.

Template and documentation drift is also a concern and must be actively managed.

---

### 12. Success Criteria

A project can be created with one command and used immediately.

The generated structure reflects intended architecture and matches documentation.

The system supports adding new presets without increasing complexity.

The release pipeline reliably produces valid packages.

---

### 13. Roadmap

#### Phase 1 — Base Preset

- Implement CLI entrypoints (`npm init`, `npx create-*`)
- Define repository structure
- Create base template (web/site/api + workspaces)
- Implement template copy and interpolation
- Add minimal prompts and generation flow
- Support optional dependency install and git init
- Validate full end-to-end project creation
- Set up release pipeline with validation checks

#### Phase 2 — Realtime Preset

- Design convex-realtime architecture as independent preset
- Adjust data layer and backend structure
- Update generation logic to support multiple presets
- Ensure preset isolation (no shared branching logic)
- Provide dedicated documentation for new preset

#### Phase 3 — Stabilization

- Improve template consistency and documentation alignment
- Refine developer experience (faster setup, clearer output)
- Harden release process and validation checks
- Validate usage across multiple real projects
