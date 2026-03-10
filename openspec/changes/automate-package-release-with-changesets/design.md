## Context

У репозитория уже есть воспроизводимые release gates: `release:check`, pack verification и publish workflow для npm. Проблема не в отсутствии проверок, а в том, что orchestration релиза остаётся ручным: мейнтейнер сам меняет версию, следит за changelog и отдельно запускает публикацию. Для этого change важно сохранить обратимость и не размыть существующий publish contract: автоматизация должна переиспользовать текущие проверки, а не вводить второй независимый release path.

## Goals / Non-Goals

**Goals:**
- Убрать ручное поднятие версии и ручную сборку changelog перед релизом.
- Сделать release intent явным и reviewable через changeset-файлы и release PR.
- Публиковать пакет автоматически после merge release PR в `main`, используя те же release gates, что и раньше.
- Сохранить совместимость с текущим npm trusted publishing через GitHub Actions OIDC.

**Non-Goals:**
- Переделка существующих build/test/pack smoke checks.
- Внедрение semver-логики вне `changesets` или ручная кастомная система versioning.
- Автоматизация публикации для нескольких пакетов.

## Decisions

### 1. `changesets` становится единственным источником release intent

Каждое изменение, влияющее на публикуемый пакет, сопровождается changeset-файлом с типом bump и короткой записью для changelog. На базе накопленных changesets automation поддерживает release PR, который обновляет `package.json`, changelog и удаляет уже применённые changeset-файлы.

Почему так:
- version bump и changelog становятся обычным reviewable diff, а не CI-side магией;
- решение о семантической версии принимается рядом с изменением, а не в конце релиза.

Альтернативы:
- `workflow_dispatch` с input `patch|minor|major`: меньше изменений, но version intent остаётся вне diff и плохо ревьюится.
- Полностью кастомный release script: больше контроля, но выше support cost и хуже совместимость с экосистемой npm.

### 2. GitHub Actions orchestration строится вокруг release PR и publish-on-main

Automation должна иметь два режима: при наличии необработанных changesets создавать или обновлять release PR, а после merge release PR в `main` запускать publish script. Publish path не дублирует шаги, а вызывает repo-level command, который сначала прогоняет release gates, затем публикует пакет.

Почему так:
- release PR отделяет подготовку версии от фактической публикации;
- publish происходит только из состояния, уже прошедшего review и попавшего в `main`.

Альтернативы:
- Публиковать прямо из release PR: сложнее контролировать branch protection и возникает риск publish до merge.
- Оставить отдельный ручной publish workflow: manual bottleneck останется.

### 3. Существующий publish contract остаётся обязательным gate перед автоматическим publish

`changesets` управляет only versioning/orchestration, но не заменяет `release:check`, pack verification и smoke path. Automation публикует только через единый publish script, где проверка и `npm publish --access public` связаны в один deterministic flow.

Почему так:
- так меньше риск drift между ручной и автоматизированной публикацией;
- текущие release guarantees уже покрывают главные packaging-риски.

Альтернативы:
- Доверить publish целиком стандартной команде action без локального release script: проще, но часть текущего release contract выпадет из явного кода репозитория.

### 4. Документация и CI guardrails обновляются вместе

Новый процесс требует явного описания: когда нужен changeset, как выглядит release PR, какие ветки публикуют и что делать при publish failure. Статические проверки workflow и release docs должны отражать именно changesets-driven flow.

Почему так:
- иначе команда быстро вернётся к ручным bump/release шагам;
- для релиза важна дебажимость не меньше автоматизации.

Альтернативы:
- Ограничиться только workflow-изменениями: быстрее, но knowledge останется скрытым.

## Risks / Trade-offs

- [Risk] Changeset-файл забудут добавить к пользовательскому изменению -> Mitigation: добавить CI/документацию, чтобы отсутствие changeset было явным и воспроизводимым сигналом.
- [Risk] Автогенерируемый release PR будет конфликтовать с параллельными изменениями в `main` -> Mitigation: использовать стандартный changesets release PR flow, который переобновляет PR от актуального `main`.
- [Risk] Publish automation может случайно выпустить нерелизный merge в `main` -> Mitigation: publish запускать только когда changesets action определил release commit и вызывает явный publish script.
- [Risk] Trusted publishing с changesets action может потребовать более аккуратной настройки permissions/env, чем текущий workflow -> Mitigation: зафиксировать это в design и проверить в implementation через статическую workflow validation и dry-run reasoning.

## Migration Plan

Изменение additive: в репозиторий добавляются `changesets` config, release workflow и release documentation, а существующий manual publish workflow либо заменяется, либо упрощается до роли publish executor внутри нового pipeline. После внедрения команда создаёт changeset для следующего изменения, automation формирует release PR, а merge этого PR должен приводить к publish через тот же release contract. Rollback до первого автоматического релиза — revert workflow/config/docs. Rollback после уже опубликованной версии вне scope и потребует обычной npm release mitigation strategy.

## Open Questions

Нет открытых вопросов. Предположение change: trusted publishing path остаётся доступным и совместимым с changesets-based publish workflow.
