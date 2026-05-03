# ADR-025: Split initial scaffolding from app templates

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-05-03 |

## Context

The generator currently models initial setup around `single` and `multi` workspace layouts from ADR-003. Both layouts generate a base project plus the initial app set (`site`, `web`, and `api`) and shared package structure.

That couples root project initialization to app selection. Users who want only repository scaffolding must remove generated apps, and users who want a different app mix must start from the fixed app set. The `single` and `multi` layout choice also makes the first setup flow responsible for both repository shape and app topology.

The template system already supports typed portable template definitions, so app templates can be represented as separate generation units instead of being embedded in the initial base scaffold.

## Decision

Replace the initial `single` / `multi` layout setup model with a root scaffold plus separate app templates.

Initial project scaffolding MUST create only the base project structure and root layout needed for a generated repository. It MUST NOT add application workspaces or package workspaces by default.

Create separate templates for the current app outputs:

- `site`
- `web`
- `api`

Each app template owns its app-specific files, package manifest behavior, and integration points needed to add that app to an already scaffolded project.

The initial scaffold becomes the common baseline for future app and package templates. Workspace configuration, generated docs, prompts, validation, and tests should reflect root initialization first, then optional app template application.

When this ADR is accepted, it supersedes ADR-003. New work should not extend the `single` / `multi` layout prompt model.

## Consequences

Positive:

- Initial setup becomes smaller and easier to reason about.
- App creation becomes composable instead of fixed to one initial app set.
- The generator can add future templates without expanding the root setup prompt into a layout matrix.
- The current `single` and `multi` concepts collapse into one root baseline.

Negative:

- This changes generated output and prompt flow for existing users.
- Existing tests, docs, fixtures, and snapshots tied to `single` / `multi` layouts must be revised.
- App templates need clear contracts for where they write files and how they update workspace configuration.
- Applying multiple templates may introduce ordering and conflict handling concerns.

## Alternatives Considered

- Keep ADR-003 and add app selection to `single` / `multi`: rejected because it preserves the layout fork and keeps root setup coupled to app topology.
- Add a third "empty" layout: rejected because it adds another branch instead of simplifying the setup model.
- Keep current generated app set and add removal options: rejected because deletion workflows are harder to validate and explain than additive templates.

## Reversibility

Rollback by restoring the `single` / `multi` layout prompt and embedding the default `site`, `web`, and `api` outputs in the base scaffold.

If app templates have already shipped, keep them as optional templates or mark them deprecated rather than deleting them immediately, so generated-project workflows have a migration path.

## Related Decisions

- [ADR-003](./adr-00003-support-single-and-multi-project-workspace-layouts.md) — superseded by this ADR when accepted.
- [ADR-009](./adr-00009-use-typed-portable-template-definitions.md) — defines the template authoring contract used by separate app templates.
