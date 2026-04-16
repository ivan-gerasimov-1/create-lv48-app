# ADR-011 Implementation Plan: Use template terminology consistently

| Decision                    |
| --------------------------- |
| [ADR-011](./ADR-011.md) |

## Goal

Unify active project terminology around `template` without changing scaffold behavior or generated output.

## Implementation

1. Rename the internal source module domain from `src/presets` to `src/templates`.
2. Rename `presetRegistry.ts` to `templateRegistry.ts`.
3. Rename exported/internal type names from `TPresetMetadata` and `TPresetRegistry` to `TTemplateMetadata` and `TTemplateRegistry`.
4. Rename `createPresetRegistry()` to `createTemplateRegistry()`.
5. Rename prompt answer field `presetId` to `templateId`.
6. Rename generation context field `preset` to `template`.
7. Update runtime references, imports, local variable names, and error text from preset terminology to template terminology.
8. Update `templates/base/template.ts` to import `defineTemplate` from the new source path.
9. Update active docs: `README.md`, `docs/PRD.md`, and `docs/SRD.md`.
10. Leave historical ADRs, ADR implementation plans, and `CHANGELOG.md` terminology unchanged unless a path reference must change.

## Verification

Run:

```bash
npm run build:typecheck
npm test
```

If build wiring or copied template paths change, also run:

```bash
npm run build
```

Expected result:

- Typecheck passes.
- Tests pass.
- Existing scaffold behavior and generated output remain unchanged except for active terminology.
- Registry lookup for an unknown id reports `Unknown template: <id>`.

## Rollback

Restore the previous `preset*` names and active documentation wording from the implementation diff. Keep generated template assets in place because this decision does not change scaffold file layout.
