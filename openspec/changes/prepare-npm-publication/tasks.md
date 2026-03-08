## 1. Public package metadata

- [x] 1.1 Update the root package manifest with public npm metadata, MIT SPDX license, repository links, and publish configuration for `create-lv48-app`
- [x] 1.2 Verify the publishable file contract so the package includes only the executable entrypoint, compiled runtime output, and template assets needed at runtime

## 2. Release-check workflow

- [ ] 2.1 Add explicit npm scripts or equivalent repo-level commands for release readiness checks that run build, affected tests, and tarball verification in a documented order
- [ ] 2.2 Add a tarball verification test or helper that fails when required runtime files are missing from the packed artifact or when packaging drift breaks the release contract
- [ ] 2.3 Add a `workflow_dispatch` GitHub Actions workflow that uses npm trusted publishing and only publishes to npm after all release-check gates pass

## 3. Packed artifact smoke verification

- [ ] 3.1 Add a smoke test that packs the CLI, runs it from the generated tarball in an isolated temporary directory, and verifies the published entrypoint can resolve runtime template assets
- [ ] 3.2 Ensure the packed-artifact smoke path covers the published npm entrypoint behavior without requiring source-tree-only files

## 4. Release documentation and final verification

- [ ] 4.1 Document the release workflow, including local pre-publish checks, required GitHub Actions trusted publishing/OIDC setup, and the final GitHub Actions-driven `npm publish` path
- [ ] 4.2 Run the affected build and test commands plus the release-check workflow, then validate the GitHub Actions config statically and fix any verification gaps before handoff
