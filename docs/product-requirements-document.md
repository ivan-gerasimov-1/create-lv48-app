# Product Requirements Document

## LV48 CLI Initializer

### Relation to System Requirements

Implementation details for this product are defined in `lv48-cli-system-requirements.md`.
Any changes to architecture, presets, or generation behavior must be reflected in both documents.

---

### 1. Context and Motivation

Starting a new project usually means repeating the same setup: monorepo, workspaces, app boundaries, configs. This work is mechanical but often inconsistent.

This tool removes that repetition by providing a consistent architectural starting point.

---

### 2. Product Definition

LV48 CLI generates a ready-to-use project from a predefined preset.

It provides structure and environment, not business logic.

---

### 3. Target Users

Primary: engineers starting projects frequently.
Secondary: teams standardizing project structure.

---

### 4. Product Goals

- one-command project creation
- consistent architectural baseline
- minimal setup
- predictable output
- extensibility via presets

---

### 5. Non-Goals

- no business logic generation
- no universal configurability
- no infra or deployment
- no replacement of system design

---

### 6. Product Behavior

CLI runs via `npm init lv48-app` or `npx create-lv48-app`.

It collects minimal input, generates project from template, optionally installs deps and initializes git, then shows next steps.

Errors must be explicit.

---

### 7. Generated Architecture

Monorepo with:

- apps/web
- apps/site
- apps/api
- packages/

Each app contains minimal working setup.
README files must match structure.

---

### 8. Preset Strategy

Presets define full architectures.

Phase 1: base preset
Future: convex-realtime as separate preset

No extension via flags.

---

### 9. Constraints

- simple system design
- local templates
- minimal user input
- npm workspaces

---

### 10. Release

Published via npm with reproducible pipeline (GitHub Actions + release-please).

---

### 11. Risks

- overcomplexity
- preset leakage
- template drift

---

### 12. Success Criteria

- one-command setup
- ready-to-use structure
- correct architecture
- matching documentation
- reliable releases

---

### 13. Roadmap

#### Phase 1 — Base Preset

- CLI entrypoints
- template + generation
- prompts
- install/git options
- end-to-end validation
- release pipeline

#### Phase 2 — Realtime Preset

- convex-realtime architecture
- preset isolation
- generation support
- documentation

#### Phase 3 — Stabilization

- template consistency
- DX improvements
- release hardening
- real-world validation
