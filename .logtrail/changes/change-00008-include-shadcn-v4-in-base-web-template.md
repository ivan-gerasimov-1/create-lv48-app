# CHANGE-008: Include shadcn v4 in base web template

| Status | Date       | ADRs                                                                   |
| ------ | ---------- | ---------------------------------------------------------------------- |
| Done   | 2026-04-15 | [ADR-008](./adrs/adr-00008-include-shadcn-v4-in-base-web-template.md) |

## Goal

Update the base web template so generated apps include a working shadcn v4 baseline without adding unrelated app architecture.

## Scope

Implement [ADR-008](./adrs/adr-00008-include-shadcn-v4-in-base-web-template.md).

## Implementation

1. Update `templates/base/apps/web/components.json` to the complete shadcn v4 shape.
2. Rename the web CSS entry from `src/global.css` to `src/main.css`.
3. Update `templates/base/apps/web/src/main.tsx`, `components.json`, and docs to reference `src/main.css`.
4. Update `templates/base/apps/web/package.json` dependencies for the shadcn v4 surface:
   - add `shadcn`, `radix-ui`, `lucide-react`, `tw-animate-css`
   - add `@fontsource-variable/geist-mono` and `@fontsource-variable/noto-serif`
   - align Tailwind, Vite, plugin, and `tailwind-merge` versions with the shadcn v4 setup when compatible
   - remove `@radix-ui/react-slot`
5. Replace `templates/base/apps/web/src/components/ui/button.tsx` with the expanded shadcn button component.
6. Add starter shadcn UI components:
   - `input.tsx`
   - `textarea.tsx`
   - `dialog.tsx`
   - `dropdown-menu.tsx`
7. Keep the `cn()` helper API in `templates/base/apps/web/src/lib/utils.ts`.
8. Update `templates/base/apps/web/src/App.tsx` and README copy to show that shadcn v4 is included.

## Verification

Run:

```bash
npm run test
npm run build:typecheck
```

Expected result:

- Tests pass.
- Typecheck passes.
- ADR files and ADL row point to the same Accepted decision.

Optional generated-app check when dependency installation is available:

```bash
npm install
npm run build --workspace <webPackageName>
```

Expected result:

- Generated web package installs and builds with shadcn dependencies.

## Rollback

Restore the previous web template files, remove added shadcn dependencies and UI components, restore `src/global.css`, and remove or supersede ADR-008 in `docs/adl.md`.
