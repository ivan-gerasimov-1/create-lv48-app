## 1. Preset asset simplification

- [ ] 1.1 Remove generated shared package template assets from `templates/base/packages/*` while preserving the top-level `packages/` directory in the scaffold.
- [ ] 1.2 Extend scaffold generation so empty template directories are created in the output without relying on marker files.
- [ ] 1.3 Update the base template README to describe `packages/` as a future workspace container instead of listing starter packages.

## 2. Scaffold contract updates

- [ ] 2.1 Update the baseline scaffold smoke test to expect only `apps/*`, root files, and an empty reserved `packages/` directory.
- [ ] 2.2 Remove package-specific content assertions from scaffold verification and replace them with an assertion that the reserved `packages/` directory is generated without extra files.

## 3. Spec and doc alignment

- [ ] 3.1 Update the `preset-project-scaffolding` spec text to describe the simplified baseline structure and README contract.
- [ ] 3.2 Update product-facing docs that still describe generated shared packages so they match the new scaffold output.

## 4. Verification

- [ ] 4.1 Run the affected test suite for scaffold generation and fix any regressions.
- [ ] 4.2 Run build/typecheck for `create-lv48-app` after the scaffold simplification and capture any follow-up fixes if needed.
