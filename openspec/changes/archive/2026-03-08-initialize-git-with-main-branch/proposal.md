## Why

Сейчас optional `git init` опирается на дефолтную branch naming policy конкретной git-установки, поэтому новые проекты могут стартовать с `master` вместо ожидаемого `main`. Это делает generated baseline менее предсказуемым и расходится с уже принятым в репозитории и CI branch convention.

## What Changes

- Зафиксировать contract для optional git initialization: новый репозиторий в сгенерированном проекте должен создаваться с initial branch `main`.
- Уточнить post-setup behavior так, чтобы CLI обеспечивал `main` независимо от локального дефолта Git, сохраняя текущее reversible поведение при optional-step ошибках.
- Добавить тестовое покрытие для успешной и совместимой инициализации git-репозитория с branch `main`.

## Non-goals

- Изменение branch name в уже существующих репозиториях или миграция пользовательских remote settings.
- Изменение других post-setup шагов, prompt flow или глобальной git-конфигурации пользователя.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `project-initializer-cli`: optional git initialization must create the generated repository with `main` as the initial branch instead of inheriting a machine-specific default branch name.

## Impact

Affected areas: `src/cli/postSetup.ts`, CLI bootstrap tests for post-setup command execution, and the `project-initializer-cli` spec delta for optional git initialization behavior.
