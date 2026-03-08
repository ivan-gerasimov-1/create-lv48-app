# SRD — System Requirements Document for npm Initializer / Scaffold CLI

## 1. System overview

Система представляет собой CLI-пакет формата `create-*`, предназначенный для генерации новых проектов из заранее подготовленных шаблонов.

Основной способ запуска:

```bash
npm init lv48-app
```

или:

```bash
npx create-lv48-app
```

CLI должен:

- принимать пользовательский ввод
- выбирать preset
- копировать template files
- применять трансформации
- выполнять optional post-setup шаги

## 2. System goals

Система должна:

- создавать baseline SaaS-монорепу на основе npm workspaces по одной команде
- поддерживать preset-based architecture
- минимизировать ручной setup
- встраивать README-инструкции в generated project
- быть основой для дальнейшей реализации через OpenSpec

## 3. High-level architecture

### 3.1 Package type

Initializer должен быть опубликован как npm package вида:

- `create-lv48-app`

### 3.2 Runtime model

CLI выполняется в Node.js runtime и использует локальную файловую систему для генерации проекта.

### 3.4 Release model

Публикация пакета должна опираться на воспроизводимый release pipeline: локальный release-check и GitHub Actions workflow обязаны использовать один и тот же набор verification gates перед `npm publish`. Automation path в первой версии фиксируется как `workflow_dispatch` + npm trusted publishing через OIDC.

### 3.3 Internal architecture

Система должна состоять из следующих logical layers:

- CLI entrypoint
- prompt/input layer
- preset resolver
- template copier
- variable interpolation layer
- file transform layer
- post-setup executor
- output logger / summary layer

## 4. Package structure requirements

Рекомендуемая структура:

```txt
create-lv48-app/
  package.json
  bin/
    create-lv48-app.js
  src/
    cli.ts
    prompts.ts
    generate.ts
    presets/
      base/
      convex-realtime/
    transforms/
      packageJson.ts
      placeholders.ts
      renameSpecialFiles.ts
      env.ts
    utils/
      fs.ts
      validation.ts
      logging.ts
  templates/
    base/
    convex-realtime/
  README.md
```

Допустимо объединить `src/presets` и `templates`, если это упростит реализацию, но presets должны оставаться явной сущностью.

Пакет также должен иметь release-related assets уровня репозитория:

- `.github/workflows/` для publish workflow
- документированную release procedure

## 5. Preset model

### 5.1 Phase 1 preset support

На первом этапе система должна поддерживать preset:

- `base`

### 5.2 Phase 2 preset support

На втором этапе должна появиться поддержка:

- `convex-realtime`

### 5.3 Preset isolation requirement

Каждый preset должен:

- иметь собственную template structure
- иметь собственные metadata/rules
- иметь собственные README assets и инструкции при необходимости
- не зависеть от хаотичной матрицы feature flags

## 6. Template structure requirements

Каждый template должен содержать полноценную стартовую монорепу.

### 6.1 Base template expected structure

```txt
templates/base/
  _meta/
    template.json
  apps/
    web/
      package.json
      README.md
      index.html
      vite.config.ts
      src/
        main.tsx
        App.tsx
    site/
      package.json
      README.md
      astro.config.mjs
      src/
        pages/
          index.astro
    api/
      package.json
      README.md
      src/
        index.ts
  packages/
  README.md
  package.json.tpl
  _gitignore
  .env.example
```

`packages/` должен существовать в scaffold как пустая директория без marker-файлов, зарезервированная для будущих shared workspaces.

### 6.2 Template metadata requirements

`template.json` должен описывать минимум:

- preset id
- preset display name
- supported package managers
- placeholder keys
- optional post-generation rules

## 7. CLI requirements

### 7.1 Invocation

CLI должен поддерживать запуск:

- через `npm init …`
- через `npx create-…`
- напрямую через `bin` entrypoint

### 7.2 Prompts

CLI должен уметь спрашивать:

- project name
- target directory
- install dependencies? (`yes/no`)
- initialize git? (`yes/no`)

В phase 1 preset `base` применяется по умолчанию без отдельного prompt; часть значений может иметь default и не спрашиваться при non-interactive запуске.

### 7.3 Non-interactive support

Желательно предусмотреть возможность non-interactive режима позже, но это не обязательно для первой версии.

### 7.4 Published artifact requirement

Опубликованный npm artifact должен:

- содержать рабочий `bin` entrypoint
- содержать compiled runtime output
- содержать template assets, нужные для scaffold generation
- не зависеть от файлов, которые существуют только в исходном репозитории

### 7.5 Release trigger requirement

Публикация через GitHub Actions должна запускаться только явным trigger:

- `workflow_dispatch`

## 8. File generation requirements

### 8.1 Copy behavior

Система должна:

- копировать template files рекурсивно
- сохранять структуру директорий
- корректно создавать отсутствующие директории

### 8.2 Placeholder replacement

Система должна заменять placeholders в template files, например:

- `{{projectName}}`
- `{{packageName}}`
- `{{webName}}`
- `{{siteName}}`
- `{{apiName}}`

Список placeholders должен быть централизованным и валидируемым.

### 8.3 Special file rename

Система должна поддерживать переименование special files, например:

- `_gitignore` → `.gitignore`
- `_npmrc` → `.npmrc`
- аналогичные случаи при необходимости

### 8.4 JSON transforms

Система должна уметь структурно модифицировать:

- root `package.json`
- workspace package names
- metadata fields
- workspace `package.json` scripts and names

Нужно избегать хрупкого string replace там, где можно работать через parse/write.

## 9. Generated project requirements

### 9.1 Baseline output structure

Generated project phase 1 должен содержать:

```txt
apps/
  web/
    package.json
    README.md
    index.html
    vite.config.ts
    src/
      main.tsx
      App.tsx
  site/
    package.json
    README.md
    astro.config.mjs
    src/
      pages/
        index.astro
  api/
    package.json
    README.md
    src/
      index.ts

packages/

package.json
README.md
```

### 9.2 Baseline generated documents

Generated README files должны быть согласованы с generated structure и setup path.

### 9.3 Baseline stack verification

Smoke verification для phase 1 должна подтверждать не только наличие starter files, но и то, что:

- `apps/web` содержит ожидаемый Vite + React entry pattern (`index.html`, `src/main.tsx`, `src/App.tsx`, `vite.config.ts`)
- `apps/site` содержит ожидаемый Astro entry pattern (`astro.config.mjs`, `src/pages/index.astro`)
- `apps/api` содержит ожидаемый минимальный Hono entry pattern (`src/index.ts` с Hono app bootstrap)
- `packages/` создаётся как пустая зарезервированная директория без дополнительных файлов

### 9.4 Package manager assumption

Phase 1 package manager:

- `npm`

CLI может запускаться через npm/npx, а output project должен быть рассчитан на монорепо на основе npm workspaces.

## 10. Post-setup requirements

### 10.1 Dependency installation

Если пользователь согласен, CLI должен выполнять установку зависимостей через `npm install`.

### 10.2 Git initialization

Если пользователь согласен, CLI должен:

- выполнить `git init`
- по возможности создать первый `.gitignore`
- не падать молча при ошибке git

### 10.3 Final summary

После генерации CLI должен вывести:

- что создано
- что применён baseline preset `base`
- что проект использует `npm`
- были ли установлены зависимости
- был ли инициализирован git
- какие команды выполнить дальше

## 11. Validation requirements

### 11.1 Name validation

Система должна валидировать:

- project name
- npm-compatible package name
- target directory conflicts

### 11.2 Directory safety

Система должна:

- предупреждать, если директория не пуста
- позволять безопасно прервать процесс
- избегать молчаливого перезаписывания файлов

### 11.3 Partial generation handling

Если генерация оборвалась, CLI должен:

- явно сообщить, что произошло
- по возможности указать, какие файлы уже были созданы
- не притворяться, что всё прошло успешно

## 12. Preset extensibility requirements

Система должна быть устроена так, чтобы новый preset можно было добавить через:

- новую template directory
- новый preset metadata file
- optional preset-specific transforms
- optional preset-specific README instructions

Без переписывания всего генератора.

## 13. Documentation generation requirements

Сгенерированный проект должен содержать:

- root README
- project-level README files для generated apps и packages
- инструкции, согласованные с generated structure и setup path

Эти README assets должны быть versioned template-assets, а не только строками, зашитыми в код генератора.

## 14. Implementation constraints

### 14.1 Simplicity first

На первом этапе не требуется:

- plugin system
- remote template registry
- template inheritance engine
- сложная система миграции старых сгенерированных проектов

### 14.2 Template-local truth

По возможности template должен быть самодостаточным. Генератор не должен собирать половину проекта из случайных string fragments по коду.

### 14.3 Structured transforms over text hacks

Где возможно, нужно предпочитать:

- JSON parse/write
- metadata-driven replacement
- явные rules

вместо хрупких regexp-хаков по большим файлам.

## 15. Operational requirements

Система должна работать в обычной локальной среде разработки:

- macOS
- Linux
- Windows, где это практически возможно

Минимально необходимы:

- Node.js runtime
- доступ к файловой системе
- доступность package manager commands для optional install steps

Для автоматизированной публикации также необходимы:

- GitHub Actions runner
- npm trusted publishing через OIDC между GitHub Actions и npm

## 16. Security and trust considerations

Initializer не должен:

- выполнять произвольный удалённый код без явного решения пользователя
- скачивать шаблоны из неизвестных источников в первой версии
- подменять команды установки зависимостей непрозрачным поведением

Все post-setup действия должны быть явными и ожидаемыми.

GitHub Actions publish path не должен:

- публиковать пакет без прохождения verify gates
- хранить registry credentials в репозитории или в виде long-lived npm token для этого workflow
- выполнять publish из непроверенного workflow path

## 17. Main technical risks

### 17.1 Template drift

README instructions и реальная структура template могут начать расходиться.

### 17.2 Preset sprawl

С ростом числа presets генератор может стать трудно поддерживать.

### 17.3 Over-abstraction

Слишком ранняя “архитектура генератора” может сделать код сложнее самой задачи.

### 17.4 Coupling between CLI and templates

Если template logic слишком сильно зашить в код генератора, станет трудно развивать шаблоны независимо.

### 17.5 Convex preset under-modeling

Если preset для Convex сделать поверхностным, он окажется архитектурно нечестным.

### 17.6 Release path drift

Локальный release-check и GitHub Actions publish могут разойтись по шагам и давать разные результаты.

## 18. Recommended implementation guardrails

1. Один create-package.
2. Один сильный preset `base` в первой версии.
3. `convex-realtime` добавлять как отдельный preset, а не как флаг.
4. Templates хранить внутри пакета на старте.
5. Минимизировать количество обязательных вопросов пользователю.
6. Root и project-level README должны лежать рядом с generated code.
7. Структурные transforms предпочтительнее строковых хаков.
8. Package manager phase 1 — `npm`.
9. Baseline phase 1 опирается только на npm workspaces.
10. Ошибки должны быть понятными и не маскироваться.
11. Генератор должен создавать baseline, а не пытаться генерировать весь мир.
12. GitHub Actions publish должен использовать те же release gates, что и локальный release-check.

## 19. Suggested next implementation step

Следующий практический шаг после этих документов:

- спроектировать структуру самого CLI-репозитория
- сделать `base` template с workspace manifests и starter files для `web/site/api`
- реализовать prompts + copy + transforms + post-setup
- проверить end-to-end сценарий `npm init …`
- добавить release-check и GitHub Actions publish workflow для публичного npm package
- после стабилизации добавить preset `convex-realtime`
