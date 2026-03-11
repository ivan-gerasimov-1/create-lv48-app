## Why

Release flow должен быть прямолинейным: conventional commits выражают release intent, `release-please` собирает version bump и changelog, а release PR остаётся единственной точкой review перед publish. Спеки и документация должны описывать именно этот финальный контракт, без параллельных или устаревших release-моделей.

## What Changes

- Зафиксировать `release-please` как canonical release orchestration для single-package npm publication.
- Зафиксировать conventional commits как единственный release-intent contract для version bump и changelog generation.
- Сделать conventional commits обязательным и валидируемым контрактом для release intent.
- Зафиксировать release PR, version bump и changelog generation через `release-please`, сохранив текущие publish gates.
- Соответственно обновить продуктовую и системную документацию, включая `docs/PRD.md` и `docs/SRD.md`.

## Non-goals

- Введение долгоживущей `release` branch или отдельного branch-specific release pipeline.
- Ослабление существующих release gates, publish checks или npm trusted publishing path.
- Автоматическое вычисление semver из diff без явного conventional commit contract.

## Capabilities

### New Capabilities

- `release-please-management`: управление release PR, version bump и changelog generation через `release-please` и conventional commits.

### Modified Capabilities

- `npm-package-publication`: publish path продолжает публиковать только из release commit в `main`, а source of truth для release PR становится `release-please`.

## Impact

Affected areas: `.github/workflows/*release*.yml`, package manifests and release scripts, release-intent validation, release automation configs/docs, regression tests, `docs/PRD.md`, `docs/SRD.md`, and the release-management specs.
