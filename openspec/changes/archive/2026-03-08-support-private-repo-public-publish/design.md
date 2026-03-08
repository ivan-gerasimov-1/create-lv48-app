## Context

The current publish workflow was introduced for public npm release with GitHub Actions trusted publishing and provenance enabled by default. In practice, npm rejects provenance generation when the source repository visibility is `private`, even if the package being published is public. The result is a release path that passes local checks but fails during the final registry publish step for the current repository setup.

## Goals / Non-Goals

**Goals:**
- Keep the existing release gates unchanged: install, build, test, pack verification, and packed-artifact smoke verification.
- Support publishing the public package from the current private GitHub repository.
- Make the documented workflow and static workflow validation match the supported publish path.

**Non-Goals:**
- Reworking versioning or release triggering.
- Changing the package visibility on npm.
- Adding a second automated publish workflow.

## Decisions

### 1. Treat provenance as visibility-dependent, not mandatory

The default GitHub Actions publish command will use `npm publish --access public` without `--provenance`. This preserves the public-package release path for a private source repository while avoiding the npm registry rejection.

Alternative considered:
- Keep `--provenance` and require a public repository. Rejected because it conflicts with the current repository visibility and blocks release entirely.

### 2. Keep trusted publishing as the primary authentication path

The workflow will continue to rely on GitHub Actions OIDC (`id-token: write`) and npm trusted publishing. The change only removes provenance generation, not trusted publishing itself.

Alternative considered:
- Switch the default workflow to `NPM_TOKEN`. Rejected because token-based auth is a fallback operational choice, not a required contract change for this repository.

### 3. Update validation and documentation together with the workflow

Any static workflow validation and release docs must assert the same publish command as CI. This prevents future drift where the workflow works one way but local validation still expects provenance.

Alternative considered:
- Update only the workflow. Rejected because it would leave release checks and documentation inconsistent.

## Risks / Trade-offs

- [Risk] Losing provenance reduces supply-chain attestations for published artifacts. -> Mitigation: document that provenance can be re-enabled only after moving the source repository to public visibility.
- [Risk] Trusted publishing setup can still be misconfigured independently of provenance. -> Mitigation: keep OIDC permissions unchanged and document token-based publish as a fallback operator option.
- [Risk] Future contributors may reintroduce `--provenance` without understanding the visibility constraint. -> Mitigation: encode the expected publish command in validation and release docs.

## Migration Plan

Update the GitHub Actions workflow, workflow validation script, and release documentation in one change. Verify the updated workflow contract locally with the existing validation command. Rollback is a simple revert of those files. Re-enabling provenance later is an additive follow-up once repository visibility changes to public.

## Open Questions

None.
