# ADR-007: Migrate templates to Vite 8 and Rolldown-backed Astro

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-04-15 |

## Context

The base template currently pins Vite 7 in `apps/web`.

The `apps/site` template uses Astro, and Astro owns its internal Vite dependency. The latest available Astro version depends on Vite 7, while Vite 8 introduces the Rolldown and Oxc-backed build path.

Vite provides `rolldown-vite` as a gradual migration package for projects moving from Vite 7 toward the Vite 8 build pipeline.

Generated templates should move forward with the Vite 8 migration while keeping the rollback path small and explicit.

## Decision

Migrate the base web template directly to Vite 8.

Set `apps/web` package versions to:

- `vite@8.0.8`
- `@vitejs/plugin-react@6.0.1`
- `@tailwindcss/vite@4.2.2`
- `tailwindcss@4.2.2`

Update the base site template to the latest available Astro version and add a local Vite alias:

- `astro@6.1.6`
- `vite: npm:rolldown-vite@7.3.1`

These package versions were verified against the npm registry on 2026-04-15.

Do not use root-level npm `overrides` for this migration.

Treat the Astro setup as a Rolldown-backed Vite 7 bridge, not as native Astro support for Vite 8.

## Consequences

Positive:

- Generated web apps use Vite 8 directly.
- Generated Astro sites start exercising the Rolldown build path before Astro has native Vite 8 support.
- The Astro migration path remains local to `apps/site` and easy to inspect.

Negative:

- `rolldown-vite` is a temporary migration bridge.
- Astro integrations, MDX, image handling, or future Vite plugins may expose incompatibilities with the Rolldown-backed path.
- The site template carries an explicit follow-up to remove the alias once Astro supports Vite 8 natively.

## Alternatives Considered

- Keep Astro on ordinary Vite 7: lower risk, but gives less migration coverage.
- Force Vite 8 through root npm `overrides`: rejected because it is too implicit for generated projects and outside Astro's current dependency contract.
- Wait for Astro native Vite 8 support: safest, but delays migration feedback for generated templates.

## Reversibility

Rollback the Astro side by removing `vite: npm:rolldown-vite@7.3.1` from `apps/site/package.json`; Astro then resolves its ordinary `vite ^7.3.1` dependency.

Rollback the web side by restoring the previous Vite 7 package pins.

Supersede this ADR when Astro supports Vite 8 natively and the local `rolldown-vite` alias is no longer needed.

## Implemented By

- [CHANGE-007](./changes/change-00007-migrate-templates-to-vite-8-and-rolldown-backed-astro.md)
