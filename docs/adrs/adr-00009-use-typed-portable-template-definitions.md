# ADR-009: Use typed portable template definitions

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-04-16 |

## Context

The base preset currently reads metadata from `templates/base/_meta/template.json`.

That JSON file stores descriptive metadata and the template path. This keeps metadata weakly typed at the source boundary and makes the template less portable because the template description knows about the package-level filesystem layout.

The generator also depends on a `templateBaseDirectory` and `templateDirectory` pair, even though template assets can follow a fixed local convention.

## Decision

Use `templates/<id>/template.ts` as the source of truth for template metadata.

Each template definition MUST provide typed metadata directly to `defineTemplate()`. The copied template assets MUST live in a sibling `files` directory:

```txt
templates/<id>/
  template.ts
  files/
```

Template metadata MUST NOT contain `templateDirectory` or `templateRoot` fields. The `files` directory is the fixed asset root for every template.

A `defineTemplate(config)` helper will compute the internal `filesRoot` from the package root using `config.id` and `PACKAGE_ROOT`. The computed `filesRoot` is runtime scaffolding data, not public metadata.

## Consequences

Positive:

- TypeScript typecheck catches malformed template metadata.
- Runtime JSON parsing and metadata shape guards are no longer needed for local templates.
- Template folders become easier to move because generated assets always live next to their typed definition.
- Public metadata stops describing filesystem layout.

Negative:

- `templates/**/*.ts` must be included in typecheck and build inputs where needed.
- Published package layout must preserve the `template.ts` plus sibling `files` convention.
- The fixed `files` name becomes part of the template authoring contract.

## Alternatives Considered

- Keep JSON and remove only `description`: rejected because JSON would still hold template path data and remain the weakly typed metadata source.
- Store `templateRoot` in metadata: rejected because metadata would still know filesystem layout.
- Add a separate template resolver layer: rejected because a fixed sibling `files` convention does not need another abstraction.

## Reversibility

Rollback by restoring `_meta/template.json`, the JSON metadata loader, and the `templateBaseDirectory` plus `templateDirectory` generation contract.

Move generated assets back from `templates/<id>/files` to the previous template root layout if needed.

## Implemented By

- [CHANGE-009](../changes/change-00009-use-typed-portable-template-definitions.md)
