# CHANGE-00033: Add Node entrypoint to base API template

| Status   | Date       | ADRs |
| -------- | ---------- | ---- |
| Proposed | 2026-04-26 | -    |

## Goal

Make the generated base API workspace run as a Node.js application while keeping the Hono application export in a separate module.

## Scope

Include the base template API source files, API package scripts, package dependencies needed by the Node runtime adapter, and focused test coverage for the template output. Exclude broader Hono route changes, non-API workspaces, and new template architecture decisions.

## Implementation

1. Keep `apps/api/src/app.ts` responsible for creating and exporting the Hono app.
2. Add a separate Node.js entrypoint file under `apps/api/src` that imports the Hono app and starts an HTTP server with the official Hono Node adapter.
3. Update API `dev` and `start` scripts to execute the Node entrypoint instead of the app module.
4. Add the required Node adapter dependency with an exact version.
5. Add or update tests that validate the base template includes the server entrypoint and runs scripts through it.

## Verification

Run:

```bash
npm run test
```

Expected result:

- Existing tests pass.
- Base API template assertions confirm the app module and Node entrypoint are separate.

## Rollback

Remove the Node entrypoint file, restore API scripts to the previous `src/app.ts` target, remove the adapter dependency, and revert the related tests.
