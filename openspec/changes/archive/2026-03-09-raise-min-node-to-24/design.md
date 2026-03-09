## Context

Сейчас репозиторий уже использует Node 24 tooling на практике (`@types/node` и локальная среда), но корневой пакет всё ещё декларирует `engines.node >=20.0.0`, а generated base preset вообще не фиксирует минимальную Node-версию. Из-за этого published contract и scaffold contract расходятся с фактической поддерживаемой средой.

Изменение кросс-срезовое, потому что затрагивает одновременно опубликованный CLI, generated template manifests, документацию и тестовые проверки. Здесь важно не просто заменить строку в одном `package.json`, а выровнять все явные точки контракта.

## Goals / Non-Goals

**Goals:**
- Зафиксировать Node 24 как единственную минимальную версию для текущего репозитория и npm-пакета.
- Сделать generated base preset явно привязанным к Node 24 через package manifests и README.
- Добавить или обновить тестовые проверки, чтобы расхождение в будущем ловилось автоматически.

**Non-Goals:**
- Не добавлять новые менеджеры версий вроде `.nvmrc`, если текущий проект уже опирается на `engines`.
- Не менять версионирование зависимостей только ради полной синхронизации с Node 24.
- Не пересматривать архитектуру preset metadata или release workflow.

## Decisions

- Использовать единый контракт `>=24.0.0` во всех package manifests, где проект или generated scaffold объявляет runtime requirements.
  Альтернатива: фиксировать только корневой репозиторий. Отклонена, потому что пользователь просит изменение "по всему проекту", а generated preset тогда остался бы без явного ограничения.

- Добавить `engines.node` в root manifest base preset и в каждый workspace manifest (`apps/web`, `apps/site`, `apps/api`).
  Альтернатива: оставить ограничение только в корне generated monorepo. Отклонена, потому что отдельные workspace packages тоже являются явными package manifests и могут использоваться независимо при чтении tooling или публикационных проверках.

- Обновить README generated template короткой prerequisite-формулировкой вместо длинного compatibility-раздела.
  Альтернатива: положиться только на `engines`. Отклонена, потому что стартовая документация тоже является частью контракта baseline scaffold.

## Risks / Trade-offs

- [Некоторые пользователи на Node 20 или 22 не смогут запускать CLI или generated scaffold] -> Mitigation: зафиксировать breaking change в proposal/specs и сделать ограничение явным в manifests и README.
- [Можно пропустить одну из точек контракта и получить частичную миграцию] -> Mitigation: обновить unit/smoke-тесты на проверку `engines.node >=24.0.0` и текстовой документации.
- [Старые change-артефакты продолжают упоминать Node 20] -> Mitigation: не переписывать архивные historical artifacts; источником истины после завершения change становятся main specs и актуальный код.

## Migration Plan

1. Обновить OpenSpec proposal/design/tasks и delta specs для CLI и preset scaffold.
2. Поднять `engines.node` до `>=24.0.0` в репозитории и generated template manifests.
3. Обновить generated README и unit/smoke-тесты.
4. Прогнать `npm test`, `npm run typecheck`, `npm run build` и OpenSpec validation/verification.

Rollback возможен обратным коммитом, который возвращает прежние `engines`, README и тестовые ожидания. Изменение additive на уровне контрактов и не требует миграций данных.

## Open Questions

None.
