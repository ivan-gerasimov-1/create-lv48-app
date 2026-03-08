## 1. Private-repo public-package publish compatibility

- [x] 1.1 Update the GitHub Actions publish workflow so the private-repository release path publishes the public package without `--provenance` while keeping the existing verification gates and OIDC permissions intact
- [x] 1.2 Update workflow validation and release documentation so they assert and explain the same private-repository-compatible publish command and repository-visibility constraint
- [x] 1.3 Run the relevant validation for the changed release workflow and documentation path, then fix any issues discovered before handoff
