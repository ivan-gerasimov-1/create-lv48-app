## ADDED Requirements

### Requirement: Repository unit tests run on the built-in Node test runner
The repository SHALL execute its unit-test suite through the built-in `node:test` runner on the supported Node version range without requiring an external test-runner dependency.

#### Scenario: Developer runs the standard test command
- **WHEN** the developer runs the repository test script on a supported Node version
- **THEN** the unit-test suite runs through `node:test`
- **AND** the repository does not require `vitest` or another external test-runner package to execute the suite

#### Scenario: Developer runs the watch-mode test command
- **WHEN** the developer runs the repository watch test script on a supported Node version
- **THEN** the repository starts the built-in Node watch-mode test workflow

### Requirement: Repository tests use built-in assertion primitives
The repository SHALL express its unit-test expectations with built-in Node assertion primitives or local test helpers that do not introduce a new third-party assertion dependency.

#### Scenario: Async success and failure paths are asserted
- **WHEN** a test needs to verify resolved values, rejected promises, or absence/presence checks
- **THEN** the test suite uses built-in Node assertions or local helpers based on them
- **AND** the suite preserves the same behavioral coverage as before the migration

#### Scenario: TypeScript test tooling is aligned with the built-in runner
- **WHEN** TypeScript checks the repository test sources
- **THEN** the active TypeScript configuration includes the types needed for the built-in Node runner
- **AND** it does not rely on `vitest/globals`
