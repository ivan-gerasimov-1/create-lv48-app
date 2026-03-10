# Changesets

This repository uses GitHub Actions to manage release intent for npm publication.

- Supported release labels are defined in `.github/releaseAutomation.json`.
- Every PR is expected to carry exactly one supported release label, including `release:none`.
- PR automation owns generated files matching `release-pr-<number>.md`.
- Do not hand-edit generated release-pr files; they are regenerated from PR metadata.
