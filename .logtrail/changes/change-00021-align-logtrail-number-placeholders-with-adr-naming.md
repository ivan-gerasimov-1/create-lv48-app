# CHANGE-021: Align Logtrail number placeholders with ADR naming

| Status | Date       | ADRs                                                                              |
| ------ | ---------- | --------------------------------------------------------------------------------- |
| Done   | 2026-04-25 | [ADR-016](./adrs/adr-00016-use-kebab-case-names-for-decision-and-change-docs.md) |

## Goal

Align Logtrail workflow placeholders, examples, and templates with the canonical five-digit ADR and CHANGE naming from ADR-016.

## Scope

Included:

- Update Logtrail ADR and CHANGE templates from `ADR-NNN` / `CHANGE-NNN` placeholders to `ADR-NNNNN` / `CHANGE-NNNNN`.
- Update Logtrail skill examples and lookup text so explicit number parsing still accepts short user input, but generated identifiers and paths use five digits.
- Update active verification/search guidance that still treats `ADR-NNN` or `CHANGE-NNN` as canonical placeholders.

Excluded:

- Runtime CLI code changes.
- Renaming existing ADR or CHANGE record files.
- Rewriting historical prose where old names are intentionally part of rollback/history context.

## Implementation

1. Update `.agents/skills/logtrail-prepare-adr/assets/adr-template.md` to use `ADR-NNNNN` in the heading and `CHANGE-NNNNN` in the implementation placeholder.
2. Update `.agents/skills/logtrail-prepare-change/assets/change-template.md` to use `CHANGE-NNNNN` in the heading.
3. Update `.agents/skills/logtrail-prepare-adr/SKILL.md`, `.agents/skills/logtrail-prepare-change/SKILL.md`, and `.agents/skills/logtrail-implement/SKILL.md` examples so generated identifiers and paths show five digits after normalization.
4. Update active docs verification guidance for ADR-016 naming cleanup so stale `ADR-NNN` / `CHANGE-NNN` placeholders are not presented as canonical.

## Verification

Run:

```bash
rg -n "ADR-NNN(?!NN)|CHANGE-NNN(?!NN)|doadrs/ADR-|dochanges/CHANGE-" . --pcre2
npm run test
```

Expected result:

- Search returns only intentional historical rollback references, if any.
- Tests pass.

## Rollback

Revert the documentation and skill-template edits from the implementation commit. No runtime migration or data rollback is required.
