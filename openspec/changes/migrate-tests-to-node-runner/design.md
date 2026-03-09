## Context

Сейчас репозиторий использует внешний test runner только для запуска unit-тестов и `expect`-style assertions. При этом проект уже зафиксировал `engines.node >=20.0.0`, текущая локальная среда работает на Node `24.13.0`, а существующий suite не использует browser environment, snapshot tooling или отдельный mocking layer. Основная сложность миграции не в раннере, а в том, что один большой test file опирается на matcher-цепочки `expect(...).resolves`, `rejects`, `not` и на test-specific TypeScript typings.

## Goals / Non-Goals

**Goals:**
- Убрать внешний test runner из devDependencies и запускать unit-тесты средствами встроенного Node test stack.
- Сохранить текущий behavioral охват тестов без добавления новой assertion-библиотеки.
- Сделать test scripts и TypeScript config совместимыми с новым runner на поддерживаемой версии Node.

**Non-Goals:**
- Достигать полного API-совпадения с прежним matcher DSL.
- Добавлять сложный adapter layer, который эмулирует весь matcher DSL поверх встроенного Node stack.
- Менять production-модули без необходимости, если перенос тестов можно сделать через стандартные Node assertions.

## Decisions

- Использовать встроенный Node test stack и стандартные assertion primitives как единственный test stack репозитория.
  Альтернатива: оставить внешний test runner. Отклонена, потому что текущий suite не использует его сильные стороны настолько, чтобы оправдывать отдельную зависимость и конфиг.
- Переписать assertions на явные `assert.equal`, `assert.deepEqual`, `assert.match`, `assert.rejects` и вспомогательные локальные проверки вместо сохранения `expect`-style API.
  Альтернатива: добавить тонкий compatibility wrapper с `expect`. Отклонена, потому что это возвращает скрытую магию и оставляет проект с кастомным mini-framework вместо прозрачного Node API.
- Запускать TypeScript tests через существующую локальную инфраструктуру без browser/test environment config и убрать отдельный runner config из активной конфигурации.
  Альтернатива: держать отдельный runner config-файл ради совместимости. Отклонена, потому что цель миграции как раз в упрощении test toolchain.
- Проверить watch-режим через встроенный Node tooling и считать его best-effort developer workflow, а не причиной сохранять внешний test runner.
  Альтернатива: считать DX watch-режима блокером миграции. Отклонена, потому что базовая встроенная поддержка уже есть в целевой версии Node, а проекту важнее низкий dependency surface.

## Risks / Trade-offs

- [Потеря краткости matcher-DSL] -> Mitigation: держать assertions прямолинейными, а повторяющиеся async/file-system проверки оформлять небольшими локальными helper-функциями внутри test suite.
- [Регресс в watch/test CLI поведении] -> Mitigation: явно зафиксировать `npm test` и `npm run test:watch` scripts и прогнать их на поддерживаемой версии Node.
- [Скрытые runner-specific assumptions] -> Mitigation: во время миграции найти и удалить все ссылки на прежний runner-specific typing и matcher-цепочки, которые не имеют прямого аналога во встроенных Node assertions.

## Migration Plan

Изменение additive и обратимое на уровне tooling: сначала переписать tests и scripts на встроенный Node runner, затем удалить прежний runner и его config из репозитория, после чего прогнать `npm test`, `npm run test:watch` и `npm run typecheck`. Rollback возможен обратным коммитом, возвращающим внешний runner, scripts и тестовый синтаксис; миграций данных или необратимых преобразований нет.

## Open Questions

Нет.
