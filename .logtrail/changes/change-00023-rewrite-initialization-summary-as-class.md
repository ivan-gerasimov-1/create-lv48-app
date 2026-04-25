# CHANGE-00023: Rewrite initialization summary as class

| Status | Date       | ADRs |
| ------ | ---------- | ---- |
| Done   | 2026-04-25 | -    |

## Goal

Rewrite the CLI initialization summary helpers as an `InitializationSummary` class with `build` and `format` methods while preserving current summary content and CLI output.

## Scope

Included:

- Replace `buildInitializationSummary` and `formatInitializationSummary` usage with `InitializationSummary.build(...)` and `InitializationSummary.format(...)`.
- Keep the existing `TBuildSummaryOptions` and `TInitializationSummary` data shape unless implementation shows a local type rename is required.
- Update summary unit tests and CLI call sites for the class API.

Excluded:

- Changes to post-setup execution behavior.
- Changes to scaffold record collection.
- Changes to final summary text beyond API-preserving formatting needs.

## Implementation

1. Add an exported `InitializationSummary` class in `src/cli/summary.ts`.
2. Move current summary construction into `InitializationSummary.build(options)`.
3. Move current text rendering into `InitializationSummary.format(summary)`.
4. Update `src/cli.ts` imports and calls to use the class API.
5. Update `src/cli/summary.test.ts` to cover the class API and preserve failure next-step behavior.

## Verification

Run:

```bash
npm run test
```

Expected result:

- Summary tests pass with `InitializationSummary.build` and `InitializationSummary.format`.
- Full CLI test suite passes without summary output regressions.

## Rollback

Restore the previous exported helper functions, revert `src/cli.ts` and `src/cli/summary.test.ts` to the helper API, and remove this class-based CHANGE from follow-up implementation if no code shipped.
