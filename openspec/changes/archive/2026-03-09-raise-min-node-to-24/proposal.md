## Why

Проект уже развивается и тестируется на Node 24, но в части артефактов все еще обещает поддержку Node `>=20`. Это создаёт неявный контракт, при котором опубликованный CLI и сгенерированный scaffold могут выглядеть совместимыми с более старым runtime, чем команда реально хочет поддерживать.

## What Changes

- Поднять минимальную поддерживаемую версию Node.js до 24 для самого репозитория и опубликованного пакета `create-lv48-app`.
- Обновить baseline `base` preset так, чтобы сгенерированный monorepo также явно требовал Node 24 в package manifests и стартовой документации.
- Обновить smoke/unit-проверки и сопутствующие документы, чтобы контракт на Node 24 проверялся автоматически.

## Non-goals

- Не менять package manager, структуру шаблона или runtime stack приложений.
- Не расширять поддержку на несколько диапазонов Node и не вводить отдельную матрицу совместимости.
- Не перестраивать release/test workflow сверх необходимых изменений под новый минимальный runtime.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `project-initializer-cli`: опубликованный CLI должен явно декларировать минимально поддерживаемую версию Node.js.
- `preset-project-scaffolding`: сгенерированный base preset должен фиксировать и документировать минимальную версию Node.js как 24.

## Impact

Затронуты [package.json](/Users/ivan/Developer/lv48/create-lv48-app/package.json), [package-lock.json](/Users/ivan/Developer/lv48/create-lv48-app/package-lock.json), шаблоны в [/Users/ivan/Developer/lv48/create-lv48-app/templates/base](/Users/ivan/Developer/lv48/create-lv48-app/templates/base), unit/smoke-тесты в [tests/cliBootstrap.test.ts](/Users/ivan/Developer/lv48/create-lv48-app/tests/cliBootstrap.test.ts) и основные OpenSpec-спеки для CLI и scaffold baseline.
