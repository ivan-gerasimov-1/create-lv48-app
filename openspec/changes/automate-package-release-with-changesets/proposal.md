## Why

Сейчас публикация `create-lv48-app` зависит от ручного поднятия версии и отдельного ручного запуска publish workflow. Даже при переходе на `changesets` ручное создание changeset-файла остаётся лишним ритуалом и даёт новый способ забыть release intent внутри PR.

## What Changes

- Перевести версионирование релиза на `changesets` с явным release PR, где version bump и changelog генерируются автоматически.
- Автоматизировать создание и обновление draft changeset-файла в PR по release label, чтобы автор не заводил changeset вручную.
- Автоматизировать подготовку release PR из накопленных changeset-файлов при изменениях в `main`.
- Перевести npm publish на GitHub Actions path, который публикует только после merge release PR и повторно использует существующие release gates.
- Задокументировать новый release flow для обычных изменений и для финального publish.

## Non-goals

- Переход на multi-package release orchestration или monorepo publishing.
- Автоматическая генерация release notes вне changelog, который ведёт `changesets`.
- Изменение продуктового поведения CLI или publish contract пакета за пределами release automation.

## Capabilities

### New Capabilities

- `changeset-release-management`: управление release intent через PR labels, автогенерируемые changeset-файлы, автоматический release PR и контролируемый publish после merge.

### Modified Capabilities

- `npm-package-publication`: триггер и orchestration публикации меняются с ручного `workflow_dispatch` на changesets-driven release pipeline с теми же publish gates.

## Impact

Affected areas: root `package.json`, lockfile, `.changeset/*`, pull-request automation workflows, publish workflows, release scripts/docs, and the `npm-package-publication` release specification.
