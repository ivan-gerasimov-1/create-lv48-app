# FEATURE-00005: Localized prompts

| Status   | Date       |
| -------- | ---------- |
| Proposed | 2026-05-02 |

## Context

`create-lv48-app` currently presents prompts, status messages, validation errors, and summaries in English. Users who prefer another language may need clearer onboarding text during project creation.

## Goal

Let users run the CLI with supported localized prompt and status text while preserving English as the default fallback.

## Users / Use Cases

- User: choose a supported language and complete project setup with localized prompts.
- Team: standardize setup instructions in the language used by their developers.
- Maintainer: add or update copy without scattering prompt strings through the CLI flow.

## Scope

- Support language selection through a CLI option and/or an early prompt.
- Localize user-facing prompt labels, choices, validation messages, progress messages, and final summary text.
- Fall back to English for unsupported languages or missing translations.
- Keep generated project source code and package metadata unchanged unless separately specified.

## Non-Goals

- Do not translate generated application templates.
- Do not auto-detect language from the operating system unless separately specified.
- Do not add runtime localization libraries to generated projects.
- Do not require every future language to ship in the first implementation.

## Acceptance Criteria

- Given a supported language is selected, when the CLI asks setup questions, then supported prompts and choices are shown in that language.
- Given a localized validation error is available, when user input is invalid, then the CLI shows the localized error message.
- Given a translation key is missing, when the CLI renders that message, then it falls back to English rather than failing.
- Given no language is selected, when the CLI runs, then current English behavior remains the default.

## Dependencies

- Existing prompt controller and prompt IO.
- User-facing CLI copy catalog.
- Validation message rendering.

## Risks / Rollback

Translations can drift from product behavior, and partial localization may confuse users. The feature should keep English fallback reliable.

Rollback is reversible by removing language selection and using the English message catalog directly.

## Related Features / ADRs

- ADR-012 Use Clack for interactive CLI prompts
