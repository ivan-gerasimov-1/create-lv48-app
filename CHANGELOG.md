# Changelog

## [0.9.0](https://github.com/ivan-gerasimov-1/create-lv48-app/compare/create-lv48-app-v0.8.0...create-lv48-app-v0.9.0) (2026-04-15)


### Features

* enable TypeScript declaration file generation in tsdown config ([59876d4](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/59876d4564280327b36b6c997bcc734fb3726386))

## [0.8.0](https://github.com/ivan-gerasimov-1/create-lv48-app/compare/create-lv48-app-v0.7.1...create-lv48-app-v0.8.0) (2026-04-15)


### Features

* use tsdown for cli builds ([#19](https://github.com/ivan-gerasimov-1/create-lv48-app/issues/19)) ([c12f7a8](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/c12f7a8024671cbee2d14e57120460989568a209))

## [0.7.1](https://github.com/ivan-gerasimov-1/create-lv48-app/compare/create-lv48-app-v0.7.0...create-lv48-app-v0.7.1) (2026-04-14)


### Bug Fixes

* add build step to publish workflow before npm release ([0526a6a](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/0526a6af1aed050da891c0c18b6bb1473d5e380f))

## [0.7.0](https://github.com/ivan-gerasimov-1/create-lv48-app/compare/create-lv48-app-v0.6.0...create-lv48-app-v0.7.0) (2026-04-14)


### Features

* add interactive mode and filters to deps:update script ([5d2bfb7](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/5d2bfb77d6749c573e52076f21bfe57fda326466))
* enable TypeScript declaration file generation in build config ([8b63835](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/8b63835cc575bb22f74d15e74e4de5dd9c16de8a))
* multi-project workspace layout support ([#17](https://github.com/ivan-gerasimov-1/create-lv48-app/issues/17)) ([dfda518](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/dfda5189ce6692c7c94beda52a24fc6c8b1c2aee))

## [0.6.0](https://github.com/ivan-gerasimov-1/create-lv48-app/compare/create-lv48-app-v0.5.0...create-lv48-app-v0.6.0) (2026-04-14)


### Features

* colocate test files with tested code ([#15](https://github.com/ivan-gerasimov-1/create-lv48-app/issues/15)) ([739827f](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/739827f002ede65541c715a61b97688718914c86))
* migrate from node:test to Vitest and remove custom TS loader scripts ([c6bfe30](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/c6bfe305349b2afeeb38c7e5addc127f04d09565))
* remove openspec ([c7adf8a](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/c7adf8a2d7744d5a464138e681452031f8a6b0fa))

## [0.5.0](https://github.com/ivan-gerasimov-1/create-lv48-app/compare/create-lv48-app-v0.4.0...create-lv48-app-v0.5.0) (2026-03-21)


### Features

* add bugfix-lifecycle skill for OpenSpec-based bug resolution ([f3379ce](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/f3379cef1adfb8c8992c8120d4fa17abb1c15cdf))
* add Codex environment configuration for automated setup ([5f5d8a6](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/5f5d8a6ec7c05a37de81f41fbd3dcda935f19b59))
* add feature-lifecycle skill for OpenSpec-based feature development ([880f6d0](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/880f6d00cf3db8d4423efad802acece3f60444e8))
* add feature-plan and feature-implement skills for structured development workflow ([80a5b61](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/80a5b6138659d5cc12a5cf6e77b645283a0b634a))
* add openspec workflow skills for change management and exploration ([65a176e](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/65a176e61f580350100b0b940c75bae5eb4b9b31))
* add specs for CLI and preset scaffolding behavior ([96bd174](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/96bd1747e7b79b2dd6dd396f836a60d8306201af))
* add symlink to skills directory for Claude integration ([82db212](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/82db212e93450eb25c4c487b9b93570673e7bfbc))
* add teammate-code-reviewer skill for structured code reviews ([de2d282](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/de2d282a33f4b4ca1de5ced6d31d74cfdcc49d7e))
* **cli:** show post-setup progress messages ([24edf01](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/24edf016954945f8470d55bc2b7097d5d6108a6c))
* **cli:** support --version flag ([f73b43c](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/f73b43c90f26fb6b295f6277ed6e463a36eaa0fd))
* raise minimum Node.js version to 24 across CLI and generated scaffold ([eca8879](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/eca8879e45650af472f00d5ddebe14b7ef146feb))
* simplify package release flow ([#9](https://github.com/ivan-gerasimov-1/create-lv48-app/issues/9)) ([bd44a4b](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/bd44a4bc0552098d1eedded6d91d8a5bfa5ee076))
* **skill:** enforce hard stop at section boundaries in openspec-apply-change ([035b2e2](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/035b2e23c5e55a69f3a950a27cbaec1d5c0f0af5))
* **skill:** scope feature-implement to single section with hard stop at boundaries ([38c49f3](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/38c49f3a3187f55d8953b282edf520fde2983318))


### Bug Fixes

* **ci:** quote if expression to prevent YAML parsing error ([ae92f47](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/ae92f4719d9d8456bf6ef430bf3e7d67a8c6e5aa))
* **generate:** improve scaffolding error handling and directory tracking ([07f8d3f](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/07f8d3f81ce3d682756e1007ac87b2aabf07760b))
* **release:** derive expected packed files dynamically from disk ([d1a2df9](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/d1a2df9f7d91438df650037a6ef2f709ae80d5b0))
* remove leading slash from bin path for npm compatibility ([459d684](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/459d6845548d4ecdf09b8a6a81b707e26d9dc916))
* **skill:** correct typo in feature-implement skill description ([9a9dbe7](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/9a9dbe7158cd86ab91763c9608697ce1be2c887b))
* support publishing public npm package from private repo ([a9ccd34](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/a9ccd34ad8df56aa150fbe25ab64c07fcf912816))
* **transforms:** throw on unresolved placeholder instead of passing through ([5df4889](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/5df4889e66a1bd6470c2498807181aa763323f82))
* **transforms:** wrap JSON.parse in try-catch with helpful error message ([e32cbbe](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/e32cbbe81a01a357c466e9fe710544c470afbe4a))

## [0.4.0](https://github.com/ivan-gerasimov-1/create-lv48-app/compare/create-lv48-app-v0.3.1...create-lv48-app-v0.4.0) (2026-03-21)


### Features

* add bugfix-lifecycle skill for OpenSpec-based bug resolution ([f3379ce](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/f3379cef1adfb8c8992c8120d4fa17abb1c15cdf))
* add Codex environment configuration for automated setup ([5f5d8a6](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/5f5d8a6ec7c05a37de81f41fbd3dcda935f19b59))
* add feature-lifecycle skill for OpenSpec-based feature development ([880f6d0](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/880f6d00cf3db8d4423efad802acece3f60444e8))
* add feature-plan and feature-implement skills for structured development workflow ([80a5b61](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/80a5b6138659d5cc12a5cf6e77b645283a0b634a))
* add openspec workflow skills for change management and exploration ([65a176e](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/65a176e61f580350100b0b940c75bae5eb4b9b31))
* add specs for CLI and preset scaffolding behavior ([96bd174](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/96bd1747e7b79b2dd6dd396f836a60d8306201af))
* add symlink to skills directory for Claude integration ([82db212](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/82db212e93450eb25c4c487b9b93570673e7bfbc))
* add teammate-code-reviewer skill for structured code reviews ([de2d282](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/de2d282a33f4b4ca1de5ced6d31d74cfdcc49d7e))
* **cli:** show post-setup progress messages ([24edf01](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/24edf016954945f8470d55bc2b7097d5d6108a6c))
* raise minimum Node.js version to 24 across CLI and generated scaffold ([eca8879](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/eca8879e45650af472f00d5ddebe14b7ef146feb))
* simplify package release flow ([#9](https://github.com/ivan-gerasimov-1/create-lv48-app/issues/9)) ([bd44a4b](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/bd44a4bc0552098d1eedded6d91d8a5bfa5ee076))
* **skill:** enforce hard stop at section boundaries in openspec-apply-change ([035b2e2](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/035b2e23c5e55a69f3a950a27cbaec1d5c0f0af5))
* **skill:** scope feature-implement to single section with hard stop at boundaries ([38c49f3](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/38c49f3a3187f55d8953b282edf520fde2983318))


### Bug Fixes

* **ci:** quote if expression to prevent YAML parsing error ([ae92f47](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/ae92f4719d9d8456bf6ef430bf3e7d67a8c6e5aa))
* remove leading slash from bin path for npm compatibility ([459d684](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/459d6845548d4ecdf09b8a6a81b707e26d9dc916))
* **skill:** correct typo in feature-implement skill description ([9a9dbe7](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/9a9dbe7158cd86ab91763c9608697ce1be2c887b))
* support publishing public npm package from private repo ([a9ccd34](https://github.com/ivan-gerasimov-1/create-lv48-app/commit/a9ccd34ad8df56aa150fbe25ab64c07fcf912816))
