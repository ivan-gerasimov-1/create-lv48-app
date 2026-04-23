# CHANGE-003: Support single and multi-project workspace layouts

| Status | Date       | ADRs                                                                               |
| ------ | ---------- | ---------------------------------------------------------------------------------- |
| Done   | 2026-04-14 | [ADR-003](../adrs/adr-00003-support-single-and-multi-project-workspace-layouts.md) |

## Goal

Add an optional multi-project scaffold layout while preserving the current single-project layout as the default.

## Scope

Implement [ADR-003](../adrs/adr-00003-support-single-and-multi-project-workspace-layouts.md).

## Implementation

1. Extend prompt answer types:
   - add `workspaceLayout: 'single' | 'multi'`
   - add `appProjectName: string`
2. Add prompt handling:
   - ask for workspace layout after target directory
   - default layout to `single`
   - ask for first app project name only when layout is `multi`
   - default first app project name to `project-1`
   - validate app project name with the existing project name rules
3. Keep `TPromptIO` unchanged and use the existing text prompt behavior.
4. Make destination path mapping layout-aware:
   - change `TTransformPipeline.mapDestinationPath` to receive `TGenerationContext`
   - keep current paths unchanged for `single`
   - in `multi`, map `apps/<workspace>/...` to `apps/<appProjectName>/<workspace>/...`
5. Update root package JSON transformation:
   - use `["apps/*", "packages/*"]` for `single`
   - use `["apps/*/*", "packages/*"]` for `multi`
   - keep `packageManager` set to `npm`
   - keep root package name set to `answers.packageName`
6. Update workspace package JSON transformation:
   - in `single`, app workspaces keep `@<packageName>/<appWorkspaceName>`
   - in `multi`, app workspaces use `@<appProjectName>/<appWorkspaceName>`
   - package workspaces under `packages/*` always use `@<packageName>/<packageFolderName>`
7. Update root scripts in generated `package.json`:
   - keep script names `dev:web`, `dev:site`, and `dev:api`
   - target `@<packageName>/web`, `@<packageName>/site`, and `@<packageName>/api` in `single`
   - target `@<appProjectName>/web`, `@<appProjectName>/site`, and `@<appProjectName>/api` in `multi`
8. Update placeholder values:
   - make `webPackageName`, `sitePackageName`, and `apiPackageName` layout-aware
   - add path placeholders if generated docs need them, such as `webWorkspacePath`, `siteWorkspacePath`, and `apiWorkspacePath`
9. Update template metadata:
   - add any new placeholder keys to `templates/base/_meta/template.json`
10. Update documentation:

- generated template README describes both layouts or uses layout-aware paths
- repository README documents the layout prompt and both generated shapes

11. Update tests:

- prompt collection tests for default single layout
- prompt collection tests for multi layout and first app project name
- transform tests for single app package names
- transform tests for multi app package names
- transform tests for root workspaces in both layouts
- transform tests for shared package names under `packages/*`
- CLI flow test for current single scaffold path
- CLI flow test for multi scaffold path and generated root manifest

## Verification

Run:

```bash
npm run test
npm run build
```

Expected result:

- Default CLI flow still creates `apps/web/src/main.tsx`.
- Multi CLI flow creates `apps/project-1/web/src/main.tsx`.
- Single root `package.json` contains `workspaces: ["apps/*", "packages/*"]`.
- Multi root `package.json` contains `workspaces: ["apps/*/*", "packages/*"]`.
- Multi root scripts target `@project-1/web`, `@project-1/site`, and `@project-1/api`.
- Shared package transforms still produce `@<rootPackage>/<packageFolder>`.

## Rollback

Remove layout and app project prompt fields, restore context-free destination path mapping, restore single-only package JSON transforms, and revert README/template metadata/doc updates.
