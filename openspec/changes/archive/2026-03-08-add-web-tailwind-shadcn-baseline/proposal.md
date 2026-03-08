## Why

`base` preset сейчас создаёт для `apps/web` слишком голый React + Vite starter: без базового utility-first CSS слоя, без готовой дизайн-системной точки входа и без структуры, удобной для дальнейшей сборки product UI. В результате пользователь сразу после генерации повторяет ручной setup Tailwind и shadcn, хотя это ожидаемая часть современного frontend baseline.

## What Changes

- Расширить шаблон `templates/base/apps/web`, добавив базовую интеграцию Tailwind CSS `v4` для Vite + React starter.
- Подготовить web-шаблон к использованию shadcn/ui: добавить необходимые алиасы, глобальные стили, утилиты и baseline component structure, совместимую с Tailwind `v4`.
- Обновить starter UI и README web-приложения так, чтобы generated scaffold демонстрировал готовый Tailwind + shadcn-ready baseline вместо голого HTML.
- Расширить smoke/unit verification для `base` preset, чтобы она проверяла наличие Tailwind `v4` и shadcn-ready wiring в generated `apps/web`.

## Non-goals

- Генерация полного каталога shadcn-компонентов в шаблоне.
- Добавление отдельного CLI flow для выбора frontend styling stack.
- Изменение baseline для `apps/site` или `apps/api` в рамках этого change.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `preset-project-scaffolding`: baseline scaffold для `apps/web` должен включать Tailwind CSS `v4` и shadcn-ready frontend wiring вместо минимального React + Vite starter без UI foundation.

## Impact

Affected areas: `templates/base/apps/web`, placeholder-driven scaffold output for `apps/web`, README шаблона, scaffold verification tests, и OpenSpec-описание baseline web starter semantics в capability `preset-project-scaffolding`.
