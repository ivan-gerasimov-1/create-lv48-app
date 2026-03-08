## Why

Базовый scaffold сейчас создаёт набор shared packages в `packages/`, хотя на текущем этапе они не используются и только увеличивают объём сгенерированного проекта. Это перегружает стартовую структуру, усложняет восприятие шаблона и создаёт ложное ощущение обязательной модульности там, где она пока не нужна.

## What Changes

- Упростить `base` preset так, чтобы он больше не генерировал `packages/config`, `packages/ui`, `packages/types` и `packages/utils`.
- Сохранить директорию `packages/` в сгенерированном проекте как пустой зарезервированный контейнер для будущих shared workspaces, без служебных файлов внутри.
- Обновить baseline README, smoke-тесты scaffold generation и spec/docs так, чтобы они описывали новую упрощённую структуру без shared packages.

## Non-goals

- Менять набор приложений в `apps/`.
- Убирать поддержку npm workspaces из root scaffold.
- Добавлять новые shared packages взамен удалённых.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `preset-project-scaffolding`: базовый scaffold должен создавать только `apps/*` и пустую директорию `packages/`, без генерации starter shared packages.

## Impact

Affected areas: `templates/base`, тесты scaffold generation, README шаблона, и OpenSpec-описание baseline project structure.
