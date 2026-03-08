## 1. Preset asset simplification

- [x] 1.1 Remove generated shared package template assets from `templates/base/packages/*` while preserving the top-level `packages/` directory in the scaffold.
- [x] 1.2 Extend scaffold generation so empty template directories are created in the output without relying on marker files.
- [x] 1.3 Update the base template README to describe `packages/` as a future workspace container instead of listing starter packages.

## 2. Scaffold contract updates

- [x] 2.1 Update the baseline scaffold smoke test to expect only `apps/*`, root files, and an empty reserved `packages/` directory.
- [x] 2.2 Remove package-specific content assertions from scaffold verification and replace them with an assertion that the reserved `packages/` directory is generated without extra files.

## 3. Spec and doc alignment

- [x] 3.1 Update the `preset-project-scaffolding` spec text to describe the simplified baseline structure and README contract.
- [x] 3.2 Update `docs/PRD.md` so the generated baseline structure no longer promises starter shared packages.
- [x] 3.3 Update `docs/SRD.md` so the template tree and smoke-verification sections match the empty reserved `packages/` directory.

## 4. Verification

- [x] 4.1 Run the affected test suite for scaffold generation and fix any regressions.
- [x] 4.2 Run build/typecheck for `create-lv48-app` after the scaffold simplification and capture any follow-up fixes if needed.

## 5. Verification Fixes

- [x] 5.1 Align `docs/SRD.md` baseline output structure with the empty reserved `packages/` directory.
