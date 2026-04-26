# CHANGE-031: Support version flag

| Status | Date       | ADRs |
| ------ | ---------- | ---- |
| Done   | 2026-04-26 | -    |

## Goal

Implement `FEATURE-00001` by restoring `create-lv48-app --version` as a fast, side-effect-free way to print the installed CLI package version.

## Scope

Include CLI argument handling, package version lookup, and focused tests for the version flag path.

Exclude release workflow changes, package version bumps, generated project version changes, and broad CLI parser replacement unless current argument handling cannot satisfy the feature.

## Implementation

1. Add an early `--version` check in the CLI path before interactive prompts, generation, and post-setup orchestration.
2. Read the version from package metadata that is available to the source and published build output.
3. Print exactly one version line through the existing logging/output boundary used by the CLI.
4. Add tests proving `--version` prints the package version and does not collect prompts, write scaffold files, install dependencies, or initialize git.
5. Keep the existing no-flag scaffold flow unchanged.

## Verification

Run:

```bash
npm run test
```

Expected result:

- `--version` prints the current package version.
- Version flag path exits before prompts and generation side effects.
- Existing CLI scaffold tests still pass.

If implementation depends on build output packaging, also run the package validation or build command that verifies package metadata is available in the published artifact.

## Rollback

Remove the version flag check and related tests. This returns the CLI to the prompt-first behavior documented after `CHANGE-00018`.

## Related

- FEATURE-00001: Support version flag
- CHANGE-00018: Remove version flag
