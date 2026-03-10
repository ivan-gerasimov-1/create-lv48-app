## Context

У репозитория уже есть воспроизводимые release gates: `release:check`, pack verification и publish workflow для npm. Проблема не в отсутствии проверок, а в том, что orchestration релиза остаётся ручным: мейнтейнер сам меняет версию, следит за changelog и отдельно запускает публикацию. Для этого change важно сохранить обратимость и не размыть существующий publish contract: автоматизация должна переиспользовать текущие проверки, а не вводить второй независимый release path.

## Goals / Non-Goals

**Goals:**
- Убрать ручное поднятие версии и ручную сборку changelog перед релизом.
- Сделать release intent явным и reviewable через PR labels, автогенерируемый changeset и release PR.
- Публиковать пакет автоматически после merge release PR в `main`, используя те же release gates, что и раньше.
- Сохранить совместимость с текущим npm trusted publishing через GitHub Actions OIDC.

**Non-Goals:**
- Переделка существующих build/test/pack smoke checks.
- Внедрение semver-логики вне `changesets` или ручная кастомная система versioning.
- Автоматизация публикации для нескольких пакетов.

## Decisions

### 1. Release intent задаётся через PR label, а changeset генерируется automation

Для каждого PR, который должен попасть в npm-релиз, мейнтейнер или автор выставляет один из согласованных release labels, например `release:patch`, `release:minor` или `release:major`. GitHub Action по этому label создаёт или обновляет служебный changeset-файл с нужным bump type и черновым changelog summary, чтобы release intent был зафиксирован в diff без ручного редактирования `.changeset`.

Почему так:
- release intent остаётся reviewable прямо в PR;
- у автора исчезает ручной шаг создания changeset-файла;
- bump policy задаётся дискретным набором labels и меньше зависит от памяти автора.

Альтернативы:
- Ручной changeset в каждом PR: надёжно, но сохраняет лишний ритуал.
- Полностью автоматическое определение bump по diff: слишком хрупко и плохо объяснимо.

### 2. GitHub Actions orchestration строится вокруг release PR и publish-on-main

Automation должна иметь два режима: на уровне PR синхронизировать changeset-файл по release label и текущему PR state, а на уровне `main` из накопленных changesets создавать или обновлять release PR. После merge release PR в `main` запускается publish script. Publish path не дублирует шаги, а вызывает repo-level command, который сначала прогоняет release gates, затем публикует пакет.

Почему так:
- release PR отделяет подготовку версии от фактической публикации;
- publish происходит только из состояния, уже прошедшего review и попавшего в `main`.

Альтернативы:
- Публиковать прямо из release PR: сложнее контролировать branch protection и возникает риск publish до merge.
- Оставить отдельный ручной publish workflow: manual bottleneck останется.

### 3. PR automation обновляет только свой служебный changeset и не угадывает changelog произвольно

Action должен работать по узкому контракту: один label определяет bump type, а текст changeset строится из предсказуемого источника, например PR title или шаблонного summary, который можно поправить в PR. Automation обновляет только свой служебный changeset-файл для конкретного PR и удаляет его, если release label снят.

Почему так:
- это ограничивает write scope automation и снижает риск конфликтов;
- PR остаётся понятным: видно, какой changeset создан именно для этого change.

Альтернативы:
- Переписывать любые `.changeset` файлы в PR: слишком рискованно при параллельных правках.
- Хранить release intent только в label без changeset-файла до merge: release PR станет менее прозрачным и хуже совместимым с `changesets`.

### 4. Существующий publish contract остаётся обязательным gate перед автоматическим publish

`changesets` управляет only versioning/orchestration, но не заменяет `release:check`, pack verification и smoke path. Automation публикует только через единый publish script, где проверка и `npm publish --access public` связаны в один deterministic flow.

Почему так:
- так меньше риск drift между ручной и автоматизированной публикацией;
- текущие release guarantees уже покрывают главные packaging-риски.

Альтернативы:
- Доверить publish целиком стандартной команде action без локального release script: проще, но часть текущего release contract выпадет из явного кода репозитория.

### 5. Документация и CI guardrails обновляются вместе

Новый процесс требует явного описания: когда нужен changeset, как выглядит release PR, какие ветки публикуют и что делать при publish failure. Статические проверки workflow и release docs должны отражать именно changesets-driven flow.

Почему так:
- иначе команда быстро вернётся к ручным bump/release шагам;
- для релиза важна дебажимость не меньше автоматизации.

Альтернативы:
- Ограничиться только workflow-изменениями: быстрее, но knowledge останется скрытым.

## Risks / Trade-offs

- [Risk] PR получит неправильный release label и action сгенерирует неверный bump -> Mitigation: ограничить набор labels, сделать label reviewable и явно показывать сгенерированный changeset в diff.
- [Risk] Автообновление changeset будет конфликтовать с ручными правками в той же ветке -> Mitigation: action должен владеть только одним служебным файлом с детерминированным именем для конкретного PR.
- [Risk] Автогенерируемый release PR будет конфликтовать с параллельными изменениями в `main` -> Mitigation: использовать стандартный changesets release PR flow, который переобновляет PR от актуального `main`.
- [Risk] Publish automation может случайно выпустить нерелизный merge в `main` -> Mitigation: publish запускать только когда changesets action определил release commit и вызывает явный publish script.
- [Risk] Trusted publishing с changesets action может потребовать более аккуратной настройки permissions/env, чем текущий workflow -> Mitigation: зафиксировать это в design и проверить в implementation через статическую workflow validation и dry-run reasoning.

## Migration Plan

Изменение additive: в репозиторий добавляются `changesets` config, PR-level workflow для синхронизации служебного changeset по label, release workflow и release documentation, а существующий manual publish workflow либо заменяется, либо упрощается до роли publish executor внутри нового pipeline. После внедрения автор ставит release label в PR, automation формирует changeset, затем из накопленных changesets собирается release PR, а merge этого PR должен приводить к publish через тот же release contract. Rollback до первого автоматического релиза — revert workflow/config/docs. Rollback после уже опубликованной версии вне scope и потребует обычной npm release mitigation strategy.

## Open Questions

Нет открытых вопросов. Предположение change: trusted publishing path остаётся доступным и совместимым с changesets-based publish workflow.
