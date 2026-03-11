# PRD — npm Template Initializer for TS-first SaaS

## 1. Product overview

Продукт — это npm initializer / scaffolding CLI, который позволяет одной командой создавать новый проект по заранее заданной архитектуре.

Примеры целевого UX:

```bash
npm init lv48-app
```

или

```bash
npx create-lv48-app
```

Если итоговая команда будет другой, документы всё равно остаются валидными: меняется только naming initializer package и invocation syntax.

На первом этапе initializer должен создавать baseline-проект для TS-first SaaS:

- `web` — product web app на React + Vite с Tailwind CSS v4 и shadcn-ready baseline
- `site` — public site на Astro
- `api` — backend на Node + Hono
- пустую зарезервированную директорию `packages/` для будущих shared workspaces
- root README и README внутри сгенерированных apps с инструкциями

На следующем этапе должен появиться отдельный preset для Convex / realtime-first приложений.

## 2. Problem statement

Сейчас старт нового проекта требует ручной сборки одних и тех же вещей:

- создание монорепы
- настройка монорепы на основе npm workspaces
- раскладка `web` / `site` / `api`
- перенос общих config-файлов
- перенос архитектурных документов
- повторение одинаковых conventions
- ручное выравнивание структуры под выбранную архитектуру

Это замедляет старт, плодит шум и повышает шанс ранних структурных ошибок.

## 3. Product goals

Initializer должен:

- позволять создать новый проект одной командой
- давать стабильный архитектурный baseline
- снижать объём ручного setup
- кодировать архитектурные решения прямо в scaffold
- готовить основу для дальнейшей реализации через OpenSpec
- поддерживать расширение через presets без поломки базового пути

## 4. Non-goals

На первом этапе initializer не должен:

- генерировать production-ready бизнес-функционал
- покрывать все возможные архитектурные варианты
- становиться универсальным low-code конструктором
- поддерживать десятки несовместимых флагов
- иметь plugin ecosystem
- выполнять полный cloud provisioning
- автоматически деплоить проект
- заменять полноценное проектирование доменной модели

## 5. Target users

### 5.1 Primary user

Разработчик или продуктовый инженер, который:

- регулярно стартует новые SaaS-проекты
- хочет единый архитектурный baseline
- предпочитает TypeScript-first стек
- хочет запускать scaffold одной командой
- хочет затем продолжать работу через OpenSpec pipeline

### 5.2 Secondary user

Команда, которая:

- хочет стандартизировать старт новых проектов
- хочет уменьшить ручной setup
- хочет фиксировать архитектурные правила прямо в шаблоне

## 6. Core product principles

### 6.1 Scaffold, not magic

Initializer должен создавать понятный проект, а не скрывать структуру за генераторной магией.

### 6.2 Opinionated baseline

Продукт должен быть осознанно opinionated, а не пытаться понравиться всем сразу.

### 6.3 One happy path first

Сначала — один сильный baseline path. Расширение — только после стабилизации ядра.

### 6.4 Architecture encoded in files

Архитектурные решения должны быть зашиты в generated structure, README-инструкции и config, а не жить только в голове автора.

### 6.5 Presets over toggle explosion

Новые архитектурные варианты должны добавляться как presets, а не как бесконечная матрица флагов.

## 7. Product scope

### 7.1 In scope for phase 1

Initializer должен:

- создавать проект из baseline preset
- работать как `npm init …` и `npx create-…`
- спрашивать минимально необходимую информацию
- генерировать монорепу на основе npm workspaces
- копировать template files
- подставлять project-specific значения
- генерировать root README и project-level README для apps
- опционально устанавливать зависимости
- опционально выполнять `git init`
- печатать понятные next steps
- публиковаться как публичный npm package под лицензией `MIT` с воспроизводимой release-проверкой
- иметь GitHub Actions-based release path через `release-please` release PR и trusted publishing после прохождения verification gates

### 7.2 In scope for phase 2

Initializer должен поддержать второй preset:

- `convex-realtime`

Этот preset должен отражать отдельную архитектурную ветку, а не просто добавлять одну библиотеку поверх base.

### 7.3 Out of scope for phase 1

- удалённое скачивание шаблонов из произвольных репозиториев
- web UI для генерации проекта
- template marketplace
- enterprise account features
- telemetry platform
- deep infrastructure provisioning
- auto-deploy в облако из коробки

## 8. User experience

### 8.1 Main flow

Пользователь запускает команду и проходит короткий сценарий:

1. выбирает или подтверждает имя проекта
2. выбирает директорию
3. решает, устанавливать ли зависимости
4. решает, делать ли `git init`
5. получает сгенерированный проект
6. получает summary и next steps

### 8.2 Phase 1 expected default flow

Минимальный baseline flow:

- project name
- preset = `base` по умолчанию без отдельного prompt
- package manager = `npm`
- install dependencies = optional
- git init = optional

## 9. Functional requirements

### 9.1 CLI entrypoint

Система должна:

- запускаться через `npm init <name>`
- запускаться через `npx create-<name>`
- иметь понятный `bin` entrypoint
- поддерживать запуск в пустой директории или создание новой директории

### 9.2 Template generation

Система должна:

- уметь копировать baseline template
- поддерживать placeholder replacement
- корректно переименовывать служебные файлы (`_gitignore` → `.gitignore` и подобные)
- корректно обновлять `package.json`
- генерировать workspace-конфигурацию на основе root `package.json` с `workspaces`

### 9.3 Presets

Система должна:

- поддерживать хотя бы один preset в phase 1: `base`
- быть спроектированной так, чтобы позже добавить `convex-realtime`
- не смешивать разные архитектуры в один большой if/else-комбайн

### 9.4 Project metadata interpolation

Система должна подставлять:

- project name
- package names
- display name
- placeholder URLs / domains
- env values / examples
- repository metadata, где это уместно

### 9.5 Generated architecture

Phase 1 scaffold должен включать:

- `apps/web`
- `apps/site`
- `apps/api`
- пустую зарезервированную директорию `packages/` для будущих shared workspaces
- `package.json` для root workspace и каждого app
- минимальные starter files для `React + Vite + Tailwind CSS v4` с shadcn-ready wiring, `Astro` и `Node + Hono`

### 9.6 Generated documentation

Initializer должен генерировать или копировать в проект:

- `README.md`
- `README.md` внутри сгенерированных приложений

### 9.7 Post-generation actions

Initializer должен уметь:

- устанавливать зависимости по выбору пользователя
- инициализировать git по выбору пользователя
- выводить итоговые команды для старта работы

### 9.8 Error handling

Система должна:

- аккуратно обрабатывать конфликт директории
- валидировать project name / package name
- объяснять ошибки понятным языком
- откатывать процесс или честно сообщать о частично завершённой генерации

### 9.9 Package release and distribution

Система доставки initializer должна:

- публиковать `create-lv48-app` как публичный npm package
- содержать корректные package metadata для registry-facing использования, включая лицензию `MIT`
- проверять release tarball до публикации
- подтверждать, что packed artifact реально запускает CLI и видит runtime templates
- поддерживать `release-please`-driven GitHub Actions workflow, который собирает release PR из conventional commits и публикует пакет только после успешных release checks

## 10. Preset strategy

### 10.1 Base preset

Baseline SaaS-проект с архитектурой:

- React + Vite product web app с Tailwind CSS v4 и shadcn-ready baseline
- Astro public site
- Node backend
- пустой зарезервированный контейнер `packages/` для будущих shared packages
- root README и project-level README с инструкциями для apps

### 10.2 Future Convex preset

Отдельный preset для realtime-first сценариев.

Этот preset может менять:

- data layer assumptions
- backend responsibilities
- auth integration shape
- generated README instructions
- runtime structure

Convex preset не должен быть “галочкой сверху” поверх base, если архитектурно это уже другой фундамент.

## 11. Non-functional requirements

### 11.1 Maintainability

Initializer должен быть:

- простым для сопровождения
- понятным по структуре
- не перегруженным лишней абстракцией
- расширяемым через presets без боли

### 11.2 Predictability

Одинаковый input должен давать предсказуемый output.

### 11.3 Versioning clarity

Версия CLI и версия generated template output должны быть достаточно прозрачно связаны.

### 11.5 Release safety

Путь публикации должен быть:

- воспроизводимым
- проверяемым до фактического publish
- одинаковым по release gates локально и в GitHub Actions

### 11.4 Developer experience

Опыт использования должен быть:

- быстрым
- понятным
- без лишних вопросов
- без архитектурной каши после генерации

## 12. Risks

Основные риски:

- initializer станет слишком универсальным и сложным
- presets начнут течь друг в друга
- template drift между README-инструкциями и actual files
- generated project будет выглядеть слишком “демо-шаблонно”
- CLI будет сложно обновлять вместе с шаблонами
- Convex preset будет недооценён как отдельная архитектура
- первый публичный npm release может оказаться битым из-за packaging drift
- GitHub Actions release path может разъехаться с локальной проверкой

## 13. Success criteria

Продукт можно считать успешным, если:

- новый проект создаётся одной командой
- baseline-проект готов к дальнейшей работе без ручного пересоздания структуры
- generated files отражают архитектурные правила
- generated README-инструкции совпадают с generated structure
- добавление второго preset не ломает первый
- после генерации можно сразу переходить к OpenSpec-этапу и реализации
- npm package публикуется с корректным tarball и рабочим entrypoint
- GitHub Actions publish не обходит обязательные release checks
