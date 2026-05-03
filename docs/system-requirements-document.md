# System Requirements Document

## LV48 CLI Initializer

### 1. Overview

The system is a `create-*` CLI package responsible for generating new projects from predefined templates.

It is executed via:

npm init lv48-app
npx create-lv48-app

The CLI accepts user input, resolves a preset, generates files from templates, applies transformations, and optionally performs post-setup steps.

---

### 2. System Goals

The system is designed to reliably generate a baseline SaaS monorepo with a single command.

It should support preset-based architecture, minimize manual setup, and embed documentation directly into the generated project.

The output must be suitable as a starting point for further structured development.

---

### 3. Runtime Model

The CLI runs in a Node.js environment and operates entirely on the local filesystem.

Project generation is performed synchronously from bundled templates without requiring remote access.

---

### 4. Release Model

The package must be distributed via a reproducible release pipeline.

Local release checks and GitHub Actions workflows must share identical verification steps before publishing.

The release flow follows:

conventional commits → release-please PR → verified publish via OIDC

Publishing is triggered only after a release PR is merged.

---

### 5. Internal Architecture

The system is composed of distinct layers:

- CLI entrypoint
- input and prompt handling
- preset resolution
- template generation
- transformation pipeline
- post-setup execution
- output and logging

Each layer has a single responsibility and should remain independently understandable.

---

### 6. Package Structure

The project follows a structured layout separating runtime logic and templates.

Core code resides under `src/`, while templates are stored under `templates/`.

Presets may be defined either within `src/presets` or colocated with templates, but must remain explicit and isolated.

The package must include a working `bin` entrypoint and all required runtime assets.

---

### 7. Preset System

Presets define complete architectural configurations.

Phase 1 includes only a base preset. Future presets, such as `convex-realtime`, must be implemented as independent architectures.

Each preset must own its templates, metadata, and rules. Presets must not be combined through conditional logic or flags.

---

### 8. Template System

Templates represent complete project structures and must be self-contained.

Each template includes all required files for a working monorepo, along with metadata describing how it should be processed.

Template metadata is defined in a typed module and serves as the source of truth for placeholder definitions and generation rules.

The system derives file roots from a fixed structure and does not rely on dynamic path configuration.

---

### 9. File Generation

Project generation is performed by copying template files and applying controlled transformations.

This includes placeholder substitution, structural modification of JSON files, and renaming of special files such as `_gitignore`.

Transformations must be explicit and structured where possible, avoiding brittle string manipulation.

---

### 10. CLI Behavior

The CLI must support standard invocation patterns and operate in both new and existing directories.

It collects minimal user input, with sensible defaults where appropriate.

Non-interactive execution may be supported later but is not required in the first version.

---

### 11. Generated Output

The system produces a monorepo containing multiple applications and an empty shared packages directory.

Each application includes a minimal working setup aligned with the chosen stack.

Generated documentation must match the actual structure and provide accurate setup instructions.

A basic verification step must confirm that generated projects are structurally valid and runnable.

---

### 12. Post-Setup Actions

After generation, the system may install dependencies and initialize a Git repository based on user input.

These steps must be explicit and must not fail silently.

A final summary must describe what was created and how to proceed.

---

### 13. Validation and Safety

The system must validate project names and ensure compatibility with npm package naming rules.

Directory conflicts must be handled safely, with clear warnings and the ability to abort.

If generation fails, the system must clearly report the partial state and avoid misleading success messages.

---

### 14. Extensibility

The architecture must allow adding new presets without modifying core generation logic.

A new preset should be introduced by adding template assets and metadata, with optional transforms and documentation.

The system must not require a full rewrite to support additional presets.

---

### 15. Documentation

Generated projects must include a root README and application-level documentation.

These documents must be part of the template and remain consistent with generated output.

The system must not construct documentation dynamically from fragmented strings.

---

### 16. Constraints

The system prioritizes simplicity.

It does not include plugin systems, remote template registries, or template inheritance mechanisms in the initial version.

Templates should be self-contained, and transformations should be structured and explicit.

---

### 17. Operational Requirements

The CLI must function in standard local environments, including macOS, Linux, and, where practical, Windows.

It requires a Node.js runtime and filesystem access.

For publishing, GitHub Actions and npm trusted publishing via OIDC are required.

---

### 18. Security and Trust

The system must not execute remote code or download templates from unverified sources.

All actions must be explicit and predictable.

The release pipeline must enforce verification and avoid exposing long-lived credentials.

---

### 19. Risks

Key risks include template drift, preset complexity growth, over-abstraction, and coupling between generator logic and templates.

There is also a risk of divergence between local and CI release processes, as well as packaging issues during initial releases.

---

### 20. Guardrails

The system must remain focused on a single create-package with one strong base preset.

Templates must live within the package, and user interaction must remain minimal.

Structural transformations are preferred over string-based approaches.

Release validation must be consistent across local and CI environments.
