## 1. Test runner migration

- [ ] 1.1 Replace `vitest` scripts and configuration with built-in `node:test` commands in the repository tooling
- [ ] 1.2 Rewrite `tests/cliBootstrap.test.ts` to use `node:test` and built-in Node assertions while preserving current scenarios
- [ ] 1.3 Remove remaining `vitest` references from TypeScript configuration and repository files

## 2. Verification

- [ ] 2.1 Run the unit-test suite through the new default `npm test` flow and fix migration regressions
- [ ] 2.2 Run the watch-mode test command and `npm run typecheck` to confirm the developer workflow stays functional
