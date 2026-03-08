## Why

После подтверждения `npm install` и `git init` CLI может молчать заметное время, из-за чего создается ощущение, что генерация зависла. Это особенно заметно сразу после последнего prompt, когда у пользователя больше нет визуального подтверждения, что post-setup шаги вообще запустились.

## What Changes

- Уточнить CLI contract для optional post-setup шагов: перед запуском долгой операции CLI явно сообщает, что именно сейчас происходит.
- Зафиксировать, что progress-сообщения должны появляться и для установки зависимостей, и для инициализации git-репозитория.
- Добавить тестовое покрытие для progress-логов в полном CLI flow и для post-setup executor.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `project-initializer-cli`: optional post-setup actions must emit visible progress messages while they are running.

## Impact

Затронуты `src/cli.ts`, `src/cli/postSetup.ts`, типы CLI-зависимостей и bootstrap-тесты для post-setup поведения и полного CLI flow.
