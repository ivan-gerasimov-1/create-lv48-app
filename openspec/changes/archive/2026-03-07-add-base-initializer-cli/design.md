## Context

Репозиторий пока содержит только продуктовые документы и OpenSpec config, без реализации CLI и без готового change workflow. Нужно спроектировать initializer так, чтобы phase 1 быстро дал один strong happy path, но не запер расширение на второй preset. Дополнительное ограничение: generated проект должен быть читаемым и inspectable, без скрытой generator-магии.

## Goals / Non-Goals

**Goals:**
- Собрать phase 1 initializer вокруг одного published package `create-lv48-app`
- Дать предсказуемый pipeline: input -> preset resolution -> scaffold -> transforms -> optional post-setup -> summary
- Зафиксировать `base` preset как явную сущность с metadata и template assets
- Минимизировать irreversible behavior: заранее валидировать target path и не разрушать существующие файлы

**Non-Goals:**
- Реализация `convex-realtime` preset в этом change
- Полноценный non-interactive flags matrix
- Поддержка нескольких архитектур через dense feature-flag branching
- Автоматический deploy или provisioning

## Decisions

### 1. Один CLI package с явными слоями

Будет один пакет `create-lv48-app` с `bin/create-lv48-app.js` и модулями `src/cli`, `src/prompts`, `src/generate`, `src/presets`, `src/transforms`, `src/utils`.

Почему так:
- Это соответствует SRD и держит entrypoint, orchestration и file transforms раздельно.
- Для phase 1 не нужен дополнительный abstraction layer или plugin runtime.

Альтернативы:
- Один большой `cli.ts`: быстрее стартует, но быстро превращается в if/else-комбайн.
- Несколько пакетов в монорепе: преждевременно, пока usage site один.

### 2. Preset как контракт `metadata + template directory`

Каждый preset будет описываться metadata-файлом и отдельной template directory. CLI сначала резолвит preset contract, потом materialize-ит файлы из template.

Почему так:
- Это даёт явную границу для будущего `convex-realtime`.
- Template metadata может централизовать placeholder keys, supported package managers и post-generation правила.

Альтернативы:
- Жёстко зашить логику preset в коде: дешевле сначала, но плохо масштабируется и усложняет тестирование.

В phase 1 user-facing flow не спрашивает preset отдельно: CLI автоматически выбирает `base`, а preset registry остаётся внутренним контрактом для будущего расширения.

### 3. Phase 1 остаётся npm-only

В phase 1 используем только `npm` и не добавляем отдельные prompt-ы выбора package manager или preset. Generated baseline — это монорепо на основе `npm` workspaces с соответствующими командами в README.

Почему так:
- Один фиксированный менеджер делает scaffold и инструкции однозначными.
- `npm` лучше соответствует целевому UX вокруг `npm init` и снижает лишний выбор на старте.
- Такой baseline остаётся минимальным и убирает лишнюю оркестрационную сложность на первом этапе.

Альтернативы:
- Сразу поддержать несколько менеджеров: больше гибкости, но больше условной логики и выше риск битого scaffold.

### 4. Генерация через staged pipeline с reversible-first поведением

Pipeline делает preflight target directory checks до записи, затем copy, rename special files, interpolation текстовых assets и структурные JSON transforms. Если генерация падает до handoff, CLI удаляет только файлы, которые сам создал в рамках пустой target-директории; если падает optional post-setup, scaffold остаётся на диске, а CLI честно сообщает состояние.

Почему так:
- Это снижает риск частично сломанного состояния.
- JSON updates для `package.json` и metadata надёжнее, чем string replace.

Альтернативы:
- Полный best-effort без tracking записанных файлов: проще, но тяжелее разруливать ошибки.
- Только string replace во всех файлах: быстрее, но хрупко для JSON.

### 5. README assets хранятся в template, а не собираются в рантайме

Root `README.md` и project-level `README.md` для `apps/*` и `packages/*` живут в base template и проходят только interpolation, если она нужна.

Почему так:
- Инструкции остаются inspectable прямо из template без лишнего документационного шума.
- Меньше runtime-логики и меньше риска разъезда между CLI и generated README assets.

Альтернативы:
- Генерировать README-инструкции строками в коде: меньше файлов в template, но выше drift и хуже reviewability.

### 6. Base template содержит рабочие starter files, а не только пустые директории

`apps/web`, `apps/site` и `apps/api` должны содержать минимальные stack-specific starter files и собственные `package.json`, а shared packages должны содержать минимум `package.json`, `README.md` и `src/index.ts`.

Почему так:
- Это делает generated монорепо реально исполняемой основой, а не только skeleton со списком папок.
- Это убирает двусмысленность между PRD stack promises и implementation scope.

Альтернативы:
- Ограничиться пустыми директориями и README: быстрее реализовать, но получаем слишком размытый baseline и слабый acceptance criterion.

## Risks / Trade-offs

- [Risk] В будущем появится второй package-manager path, и phase 1 assumptions станут слишком жёсткими -> Mitigation: сохранить package-manager поле в preset metadata, но реализовать phase 1 только для `npm`.
- [Risk] Partial scaffold при ошибке post-setup может выглядеть как failure всего процесса -> Mitigation: разделить scaffold failure и post-setup failure в summary, печатать точные next steps.
- [Risk] Template assets быстро дрейфуют от CLI expectations -> Mitigation: добавить smoke test, который materialize-ит `base` preset и проверяет структуру, workspace manifests, starter files, README assets, placeholders и special-file renames.
- [Risk] Starter files могут существовать формально, но не отражать обещанный baseline stack -> Mitigation: в smoke test проверять конкретные entry patterns и stack-specific contents для Vite React, Astro и Hono, а не только присутствие файлов.

## Migration Plan

Изменение additive: появляется новый CLI package и новые template assets. Миграций данных или destructive операций нет. Rollback сводится к откату нового package и template directories; destructive cleanup уже сгенерированных пользовательских проектов вне scope.

## Open Questions

- На этом этапе открытых вопросов нет.
