# ADR-005: Validate package before publish

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-04-15 |

## Context

The package publish flow already expects verification before `npm publish`.

The current `release:publish` script runs plain `npm publish`, so the repository does not have a reusable package validation gate that protects both local and CI publishing.

tsdown supports package validation through `publint` and `attw`. This package is currently CLI-only, and [ADR-004](./adr-00004-use-tsdown-for-cli-builds.md) says not to add `exports`, `main`, or `types` as part of the tsdown build setup.

## Decision

Validate the package before publish with a `release:prepare` gate.

Add `publint` as an exact dev dependency and run it through tsdown during release preparation:

```json
"release:prepare": "npm run test && npm run build -- --publint"
```

Add `prepublishOnly` so direct `npm publish` and CI publish both run the same gate:

```json
"prepublishOnly": "npm run release:prepare"
```

Keep `release:publish` as the publishing command:

```json
"release:publish": "npm publish"
```

The GitHub Actions publish job keeps calling `npm run release:publish`; npm lifecycle runs `prepublishOnly` before the registry write.

Do not enable `attw` until the package exposes a public typed API.

## Consequences

Positive:

- One command protects local and CI publish.
- The package tarball shape is checked before registry write.
- The build still includes type checking through `prebuild`.
- `publint` validates publish metadata and output files without changing the CLI-only package surface.

Negative:

- `release:prepare` uses `&&`, which is less decomposed than npm lifecycle scripts.
- Publishing takes longer because tests, build, and package validation run before publish.

## Alternatives Considered

- Use `release:check` with pre/post lifecycle scripts: more decomposed, but less direct than a single preparation command.
- Enable both `publint` and `attw`: rejected because the package has no public type entrypoint.
- Add `exports`, `main`, or `types`: rejected because ADR-004 keeps the package CLI-only.

## Reversibility

This decision is reversible by removing `publint`, `release:prepare`, and `prepublishOnly`, then restoring an explicit workflow build step if desired.

The package surface stays unchanged during this decision.

## Implemented By

- [CHANGE-005](./changes/change-00005-validate-package-before-publish.md)

## Related Decisions

- [ADR-004: Use tsdown for CLI builds](./adr-00004-use-tsdown-for-cli-builds.md)
