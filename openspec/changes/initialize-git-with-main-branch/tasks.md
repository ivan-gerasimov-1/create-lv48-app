## 1. Git initialization behavior

- [x] 1.1 Update the post-setup executor so optional git initialization targets the `main` branch for newly generated repositories
- [x] 1.2 Add a compatibility fallback for Git versions that cannot set the initial branch directly, while preserving existing optional-step failure handling

## 2. Verification

- [ ] 2.1 Extend unit tests for post-setup execution to cover the `main` happy path and the compatibility fallback command sequence
- [ ] 2.2 Run the affected test/build verification for the initializer CLI and fix any gaps before handoff
