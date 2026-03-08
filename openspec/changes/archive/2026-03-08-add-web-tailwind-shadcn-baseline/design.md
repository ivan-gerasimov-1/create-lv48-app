## Context

`templates/base/apps/web` сейчас состоит из минимального Vite + React набора файлов и не задаёт никакой устойчивой frontend foundation beyond plain JSX. Для пользователей генератора это означает повторяющийся ручной setup сразу после scaffold: подключить Tailwind, настроить aliases, добавить глобальные токены и подготовить структуру под shadcn/ui.

Дополнительное ограничение этого change: использовать именно Tailwind CSS `v4`. Это важно, потому что `v4` меняет integration shape для Vite и смещает базовую конфигурацию в сторону CSS-first setup, поэтому нельзя просто переносить старый `v3`-подход с обязательным `tailwind.config.*` как baseline по умолчанию.

## Goals / Non-Goals

**Goals:**
- Сделать generated `apps/web` usable frontend baseline с Tailwind CSS `v4`.
- Подготовить scaffold к дальнейшему использованию shadcn/ui без ручной перенастройки aliases, utility helpers и глобальных темing tokens.
- Дать smoke-verifiable набор файлов и зависимостей, чтобы regression было легко поймать.

**Non-Goals:**
- Устанавливать в шаблон большой набор shadcn-компонентов.
- Расширять CLI отдельными prompt-ами про Tailwind, shadcn или styling stack.
- Перестраивать весь base preset вокруг отдельного shared UI package.

## Decisions

### 1. Tailwind `v4` подключается как app-level CSS-first baseline

В `apps/web` появится один глобальный stylesheet, импортируемый из `src/main.tsx`, где будет подключаться Tailwind `v4` и храниться базовый набор theme tokens для shadcn-style variables. Для Vite baseline должен использоваться `v4`-совместимый integration path, а не legacy setup из Tailwind `v3`.

Почему так:
- Это соответствует явному пользовательскому ограничению по версии.
- CSS-first setup проще inspect-ить в шаблоне и он лучше подходит для scaffold без лишней магии.
- App-level stylesheet даёт одно очевидное место для глобальных tokens, resets и utility wiring.

Альтернативы:
- Держать полноценный `tailwind.config.ts` как основной entrypoint: привычно, но для `v4` это уже не самый минимальный baseline.
- Вообще не добавлять глобальный stylesheet и ограничиться README-инструкцией: меньше файлов, но пользователь снова будет делать setup вручную.

### 2. Shadcn baseline ограничивается readiness, а не полной инициализацией каталога компонентов

Шаблон должен содержать только то, что реально нужно для дальнейшего использования shadcn/ui: path alias для `@/*`, `components.json`, `src/lib/utils.ts` с `cn`, глобальные CSS variables и одну демонстрационную точку использования в starter UI. Добавлять весь набор компонентов или массово тащить Radix primitives в baseline не нужно.

Почему так:
- Это сохраняет scaffold лёгким и обратимым.
- Readiness даёт практическую ценность: можно сразу добавлять shadcn-компоненты без ручной переразметки проекта.
- Полный каталог компонентов быстро раздувает template и повышает maintenance cost.

Альтернативы:
- Полноценный `shadcn init` snapshot внутри шаблона: быстрее для конечного пользователя, но тяжелее поддерживать и сложнее обновлять.
- Только README с инструкцией “донастрой потом сам”: слишком слабо для baseline improvement.

### 3. Starter UI должен доказывать, что styling pipeline реально работает

`src/App.tsx` и связанные assets нужно обновить так, чтобы generated экран использовал Tailwind classes и хотя бы один shadcn-style building block или ту же структуру utility/tokens, на которую потом будут опираться компоненты. Smoke test должен проверять не только наличие файлов, но и признаки рабочей интеграции: Tailwind `v4` dependency wiring, импорт глобального CSS, alias-ready config и обновлённый starter content.

Почему так:
- Иначе можно формально добавить зависимости, но оставить scaffold в нерабочем состоянии.
- Visual baseline в шаблоне лучше показывает пользователю, что setup уже готов.

Альтернативы:
- Проверять только наличие package dependencies: недостаточно, wiring может быть неполным.
- Оставить старый `App.tsx`: снижает ценность change и скрывает регрессии.

### 4. Verification остаётся на уровне scaffold smoke test без сетевых установок

Изменение должно верифицироваться существующими локальными тестами scaffold pipeline: список generated файлов, содержимое `package.json`, imports и starter semantics. План не должен зависеть от runtime-вызова внешних CLI или сетевой загрузки shadcn.

Почему так:
- Это соответствует restricted-network среде и keeps verification deterministic.
- Реальная ценность change в шаблоне и генерации, а не во внешнем bootstrap-скрипте.

Альтернативы:
- Интеграционный test с запуском внешнего shadcn CLI: реалистичнее, но нестабилен и избыточен для этого репо.

## Risks / Trade-offs

- [Risk] Tailwind `v4` integration path может отличаться от привычных ожиданий существующего smoke test -> Mitigation: проверять конкретные `v4`-совместимые признаки wiring, а не legacy `v3` file shape.
- [Risk] “shadcn-ready” останется слишком расплывчатым -> Mitigation: в spec и tasks явно перечислить минимальный contract: aliases, `components.json`, utility helper, global tokens, starter UI.
- [Risk] Добавление even small shadcn baseline потянет лишние зависимости в generated app -> Mitigation: ограничить baseline только реально необходимыми пакетами и не добавлять каталог компонентов без прямой пользы.

## Migration Plan

Изменение additive и затрагивает только будущий scaffold output `base` preset. Rollback сводится к откату template assets, verification и spec changes в этом репо; destructive миграций и преобразований уже сгенерированных пользовательских проектов нет.

## Open Questions

- На этапе planning открытых блокирующих вопросов нет. При implementation нужно только выбрать точный минимальный набор shadcn-ready файлов, совместимый с Tailwind `v4`, без лишнего component bloat.
