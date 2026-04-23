# CHANGE-014: Split decisions from changes

| Status | Date       | ADRs                                                         |
| ------ | ---------- | ------------------------------------------------------------ |
| Done   | 2026-04-16 | [ADR-014](../adrs/adr-00014-split-decisions-from-changes.md) |

## Goal

Migrate ADR documentation and agent skills so durable decisions live in ADR files and implementation plans live in CHANGE files.

## Scope

Update docs/process artifacts only. Do not change runtime code behavior.

## Implementation

1. Flatten ADR files to `docs/adrs/adr-NNNNN-title-slug.md`.
2. Move existing ADR implementation plans to `docs/changes/change-NNNNN-title-slug.md`.
3. Add `docs/changes.md` as the change log.
4. Remove `Implemented` from ADR statuses and mark migrated implementation records as change delivery state.
5. Update ADR and CHANGE templates and skills.

## Verification

Run:

```bash
npm run lint
npm run test
```

Expected result:

- No legacy ADR plan paths remain.
- No nested ADR directory links remain.
- Project checks pass.

## Rollback

Restore the previous nested ADR layout, restore ADR plan files, and restore `Implemented` as an ADR status.
