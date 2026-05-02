# CHANGE-00044: Add dry-run preview mode

| Status   | Date       | ADRs | Blocked By | Blocks |
| -------- | ---------- | ---- | ---------- | ------ |
| Proposed | 2026-05-02 | -    | -          | -      |

## Goal

Add `--dry-run` support so CLI can preview scaffold plan without file writes or post-setup side effects.

## Scope

Include CLI flag handling, prompt-backed preview output, skipped side effects, and tests. Exclude template content changes, new non-interactive scaffold arguments, and interactive confirmation flow.

Backed by FEATURE-00002.

## Implementation

1. Parse `--dry-run` in CLI entrypoint.
2. Keep existing prompts so project name, target directory, layout, preset, install, and git choices are available.
3. Build the same generation context used by normal scaffold flow.
4. Print preview details for project, target directory, preset, planned file generation, and skipped post-setup side effects.
5. Exit before prepare, scaffold, dependency install, and git steps.
6. Add tests for prompt-backed preview output and no write or post-setup side effects.

## Verification

Run:

```bash
npm run test
npm run build:typecheck
```

Expected result:

- Dry-run path collects answers, prints preview, and exits.
- Normal scaffold flow still works.
- No files, dependency installs, or git commands run in dry-run mode.

## Rollback

Remove `--dry-run` branch and related tests. Normal scaffold path stays unchanged.
