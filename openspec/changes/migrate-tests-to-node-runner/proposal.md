## Why

Проект специально держит низкий уровень внешних зависимостей, но текущий unit-test stack все еще опирается на `vitest` только ради запуска и assert API. Так как пакет уже требует Node `>=20` и локальная среда работает на Node `24.13.0`, есть возможность упростить toolchain и убрать отдельный test runner без потери базового покрытия.

## What Changes

- Перевести unit-тесты репозитория с `vitest` на встроенный `node:test`.
- Убрать runtime и config-зависимость от `vitest`, включая test scripts и TypeScript test typing.
- Зафиксировать минимальный набор test utilities и assert-паттернов, достаточный для текущего покрытия без добавления новой assertion-библиотеки.
- Сохранить текущий behavioral contract тестов: те же сценарии, тот же охват happy-path и failure-path для CLI bootstrap и release-проверок.

## Non-goals

- Не расширять тестовое покрытие сверх того, что нужно для безопасной миграции раннера.
- Не добавлять новую стороннюю assertion или mocking библиотеку вместо `vitest`.
- Не перестраивать production-код только ради более удобного тестирования, если текущие сценарии можно перенести напрямую.

## Capabilities

### New Capabilities

- `repository-test-workflow`: определяет встроенный в Node workflow для запуска и сопровождения unit-тестов репозитория.

### Modified Capabilities

None.

## Impact

Затронуты [package.json](/Users/ivan/Developer/lv48/create-lv48-app/package.json), [tsconfig.json](/Users/ivan/Developer/lv48/create-lv48-app/tsconfig.json), тесты в [tests/cliBootstrap.test.ts](/Users/ivan/Developer/lv48/create-lv48-app/tests/cliBootstrap.test.ts) и связанные test helper-паттерны. Из зависимостей должен уйти `vitest`; watch/test CLI будет опираться на встроенные возможности Node.
