# CHANGE-007: Migrate templates to Vite 8 and Rolldown-backed Astro

| Status | Date       | ADRs                                                                                  |
| ------ | ---------- | ------------------------------------------------------------------------------------- |
| Done   | 2026-04-15 | [ADR-007](./adrs/adr-00007-migrate-templates-to-vite-8-and-rolldown-backed-astro.md) |

## Goal

Update the base templates so generated web apps use Vite 8 directly and generated Astro sites use the Rolldown-backed Vite 7 migration bridge.

## Scope

Implement [ADR-007](./adrs/adr-00007-migrate-templates-to-vite-8-and-rolldown-backed-astro.md).

## Implementation

1. Update `templates/base/apps/web/package.json` exact package pins:
   - `vite` to `8.0.8`
   - `@vitejs/plugin-react` to `6.0.1`
   - `@tailwindcss/vite` to `4.2.2`
   - `tailwindcss` to `4.2.2`
2. Update `templates/base/apps/site/package.json`:
   - `astro` to `6.1.6`
   - add `vite` as `npm:rolldown-vite@7.3.1`
3. Keep the Vite alias local to `apps/site`; do not add root npm `overrides`.
4. Update `templates/base/apps/site/README.md` to explain that Astro uses Vite for its dev server, module graph, and build pipeline, and that `rolldown-vite` is a temporary migration bridge.
5. Add or update unit coverage that reads the template package manifests and verifies the expected exact versions and npm alias.
6. Do not change the root workspace manifest unless verification proves npm workspace resolution needs it.

## Verification

Run:

```bash
npm test
npm run build
```

Expected result:

- Tests pass.
- Build passes.
- Template manifest tests verify exact web dependency versions and the site `rolldown-vite` alias.

Run a generated-template smoke check:

```bash
npm install
npm run build --workspace <webPackageName>
npm run build --workspace <sitePackageName>
```

Expected result:

- Generated web app builds with Vite 8.
- Generated site app resolves `node_modules/vite` to package name `rolldown-vite`.
- `astro build` passes with the Rolldown-backed Vite bridge.

## Rollback

Remove `vite: npm:rolldown-vite@7.3.1` from `templates/base/apps/site/package.json` to return Astro to ordinary Vite 7 resolution.

Restore the previous web template package pins to return the web app to Vite 7.
