# System Requirements Document

## LV48 CLI Initializer

### Relation to PRD

This document implements the product defined in `lv48-cli-prd.md`.

Any changes to:

- user flow
- preset model
- generated architecture

must be reflected in both documents.

---

### 1. Overview

CLI package that generates projects from templates.

Runs via:

npm init lv48-app
npx create-lv48-app

Performs input, preset resolution, generation, transformation, and optional setup.

---

### 2. System Goals

- generate SaaS monorepo
- support preset architecture
- minimize setup
- embed documentation

---

### 3. Runtime Model

Runs in Node.js using local filesystem.

---

### 4. Release Model

Reproducible pipeline:

conventional commits → release-please → verified publish via OIDC

---

### 5. Internal Architecture

Layers:

- CLI entrypoint
- input handling
- preset resolution
- template generation
- transforms
- post-setup
- logging

---

### 6. Package Structure

Code in `src/`, templates in `templates/`.

Must include working bin and bundled templates.

---

### 7. Preset System

- Phase 1: base
- Phase 2: convex-realtime

Presets are isolated and self-contained.

---

### 8. Template System

Templates define full project structure.

Metadata defines placeholders and rules.

Assets stored locally and copied from fixed structure.

---

### 9. File Generation

- recursive copy
- placeholder replacement
- JSON transforms
- special file rename

Prefer structured transforms over string replace.

---

### 10. CLI Behavior

Supports standard invocation.

Minimal prompts.

Non-interactive mode optional later.

---

### 11. Generated Output

Monorepo with apps and packages.

Each app has minimal working setup.

Documentation must match structure.

---

### 12. Post-Setup

Optional:

- npm install
- git init

Final summary printed.

---

### 13. Validation

- name validation
- directory safety
- explicit failure reporting

---

### 14. Extensibility

New preset = new template + metadata.

No core rewrite required.

---

### 15. Documentation

README files are template assets.

Must match generated structure.

---

### 16. Constraints

- no plugins
- no remote templates
- no inheritance system

---

### 17. Operational Requirements

Works on macOS, Linux, Windows (where possible).

Requires Node.js and filesystem access.

---

### 18. Security

No remote code execution.

Explicit actions only.

Secure release pipeline.

---

### 19. Risks

- template drift
- preset complexity
- CLI-template coupling
- release mismatch

---

### 20. Guardrails

- one package
- one base preset
- presets isolated
- templates inside package
- minimal prompts
- structured transforms
- consistent release checks
