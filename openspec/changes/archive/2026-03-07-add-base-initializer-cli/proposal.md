## Why

Старт нового TS-first SaaS-проекта сейчас повторяет один и тот же ручной setup: монорепа на основе npm workspaces, раскладка `web/site/api`, shared packages и базовые README-инструкции. Нужен один opinionated initializer, который сразу создаёт устойчивый baseline и уменьшает ранние архитектурные ошибки.

## What Changes

- Добавить npm initializer `create-lv48-app` с поддержкой запуска через `npm init`, `npx create-...` и прямой `bin` entrypoint.
- Реализовать phase 1 interactive flow для имени проекта, директории, установки зависимостей и `git init`, автоматически применяя preset `base` и используя `npm` как fixed package manager.
- Добавить `base` preset, который генерирует baseline SaaS-монорепу на основе npm workspaces с `apps/web`, `apps/site`, `apps/api`, shared packages, root README, project-level README, workspace package manifests и minimal starter files для целевых стеков.
- Реализовать template pipeline: copy, placeholder interpolation, special-file rename и структурные JSON transforms.
- Добавить optional post-setup шаги и понятный итоговый summary с next steps.

## Non-goals

- Добавление `convex-realtime` preset в рамках этого change
- Поддержка plugin ecosystem или template marketplace
- Универсальная матрица feature flags
- Cloud provisioning, auto-deploy и генерация бизнес-функционала

## Capabilities

### New Capabilities
- `project-initializer-cli`: interactive CLI flow, валидация входа, directory safety, optional post-setup шаги и итоговый summary.
- `preset-project-scaffolding`: preset-driven генерация baseline-проекта из template assets с placeholder/transforms и согласованными README-инструкциями.

### Modified Capabilities
- None.

## Impact

Affected areas: новый npm package `create-lv48-app`, CLI/source modules, template assets для `base` preset, generated README assets, unit/smoke tests для scaffold pipeline и post-setup шагов.
