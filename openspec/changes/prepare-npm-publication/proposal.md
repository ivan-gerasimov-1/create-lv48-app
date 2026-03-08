## Why

CLI уже реализован и протестирован локально, но пакет пока не готов к публикации в npm: отсутствуют публичные package metadata, проверяемый release contract и зафиксированная процедура выпуска. Сейчас это блокирует реальное использование через `npm init lv48-app` и создаёт риск опубликовать неполный или нерепродуцируемый артефакт.

## What Changes

- Подготовить `create-lv48-app` к публичной публикации в npm с корректными package metadata, MIT license и publish-настройками.
- Зафиксировать release contract для публикуемого tarball: bin entrypoint, runtime assets, только нужные файлы и проверка содержимого до публикации.
- Добавить воспроизводимый release workflow с обязательными pre-publish проверками, dry-run упаковкой, smoke-проверкой install/launch из tarball и GitHub Actions job для publish.
- Задокументировать поддерживаемую процедуру релиза для ручного запуска и для GitHub Actions-based publish.

## Non-goals

- Автоматизация semver strategy, changelog generation или release notes tooling.
- Расширение feature scope самого scaffold CLI или template assets вне нужд публикации.

## Capabilities

### New Capabilities
- `npm-package-publication`: публичная упаковка, pre-publish валидация и документированный workflow публикации `create-lv48-app` в npm через GitHub Actions trusted publishing.

### Modified Capabilities
- `project-initializer-cli`: требования к npm entrypoints уточняются так, чтобы опубликованный registry-артефакт сохранял рабочий bin entrypoint и доступ к runtime template assets.

## Impact

Affected areas: root `package.json`, GitHub Actions workflow, publish-related docs/scripts, tarball verification tests, release workflow, and the `project-initializer-cli` + new `npm-package-publication` specs.
