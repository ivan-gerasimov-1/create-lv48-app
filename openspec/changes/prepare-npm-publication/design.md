## Context

`create-lv48-app` уже собирается локально и покрыт unit/smoke tests, но контракт публичного npm-пакета пока не зафиксирован. В текущем состоянии пакет остаётся `UNLICENSED`, не описывает registry-facing metadata и не имеет отдельной проверки того, что опубликованный tarball действительно содержит рабочий bin entrypoint и runtime templates. Кроме того, в репозитории пока нет `.github/workflows`, поэтому автоматизированный publish path отсутствует целиком. Для change важно сохранить reversibility: сначала делаем воспроизводимую локальную проверку publish-артефакта, и только потом поддерживаем реальный `npm publish` через GitHub Actions с теми же gates. Для этого change фиксируем MIT как лицензию пакета и GitHub Actions trusted publishing как единственный automation path.

## Goals / Non-Goals

**Goals:**
- Сделать пакет publish-ready для публичного npm registry без изменения продуктового scope CLI.
- Зафиксировать минимальный release contract: корректные public metadata, контролируемый состав tarball, рабочий bin entrypoint и доступные template assets.
- Добавить воспроизводимую pre-publish проверку, которая запускается локально и снижает риск broken first release.
- Добавить GitHub Actions workflow, который использует тот же release contract для publish в npm.
- Задокументировать workflow выпуска для локальной проверки и GitHub Actions publish.

**Non-Goals:**
- Полная автоматизация semver management, changelog generation или multi-environment release orchestration.
- Изменение UX scaffold flow, preset semantics или generated project structure, кроме того, что нужно для публикации.
- Настройка приватных registry, multi-package release orchestration или monorepo publishing.

## Decisions

### 1. Публикацию оформляем как release contract вокруг `npm pack`

Перед реальным publish система сначала собирает production build и проверяет tarball через `npm pack --dry-run` или эквивалентный pack-step. Источником истины для состава publish-артефакта остаются `files`, `bin`, `dist` и `templates` в package manifest, а не ручной список ожиданий в документации.

Почему так:
- `npm pack` максимально близок к реальному registry-артефакту.
- Это даёт обратимую проверку без сетевых побочных эффектов.

Альтернативы:
- Проверять только локальную `dist` директорию: дешевле, но не гарантирует итоговый состав tarball.
- Проверять уже опубликованную версию: слишком поздно, ошибка обнаружится после release.

### 2. Release readiness кодируем в локальных npm scripts и тестах

Release workflow должен состоять из явных команд уровня репозитория: build, tests, tarball verification и smoke install из собранного tarball. Это делает handoff простым и уменьшает знание "в голове".

Почему так:
- Один воспроизводимый набор команд проще поддерживать и документировать.
- Скрипты можно позже переиспользовать и в CI, не меняя контракт.

Альтернативы:
- Оставить только markdown-инструкцию с ручными командами: быстрее, но выше риск дрейфа и пропуска шагов.
- Сразу внедрять release automation: избыточно для первого publish.

### 3. GitHub Actions publish использует trusted publishing и те же локальные release gates

Workflow в `.github/workflows` должен запускаться через `workflow_dispatch` как явный release trigger и повторять тот же pipeline: install, build, tests, tarball verification, packed-artifact smoke test и только потом `npm publish`. Для publish используется npm trusted publishing через OIDC и явные GitHub Actions permissions; registry credentials не хранятся в repo files или в long-lived npm tokens.

Почему так:
- Один и тот же contract уменьшает расхождение между локальной и CI-публикацией.
- Publish шаг становится воспроизводимым и audit-friendly.
- Trusted publishing убирает хранение долгоживущего npm token и уменьшает operational risk первого релиза.

Альтернативы:
- Оставить GitHub Actions только для tests, а publish делать руками: проще сначала, но release остаётся knowledge-heavy.
- Дублировать отдельный CI-only release path: выше риск drift между локальной и автоматизированной проверкой.
- Использовать npm token через GitHub secrets: работает, но хуже по security posture и создаёт лишний credential lifecycle.

### 4. Smoke-проверка должна запускать CLI из упакованного артефакта

После pack-шага release workflow устанавливает или запускает CLI из полученного tarball в временной директории и подтверждает, что entrypoint стартует и получает доступ к template assets. Проверка не должна делать реальный publish и не обязана проверять весь scaffold end-to-end через сеть.

Почему так:
- Главный риск первого релиза — локально всё работает, а из tarball не хватает `templates`, `bin` или compiled output.
- Smoke-путь ловит packaging-регрессии на реальном release artifact.

Альтернативы:
- Доверять только существующим unit/smoke tests на source tree: не ловят ошибки publish packaging.
- Проверять только наличие файлов в tarball: не подтверждает, что CLI реально запускается.

### 5. Public metadata оформляем как обязательный publish gate

Package manifest должен содержать валидные registry-facing поля: SPDX license `MIT`, repository/homepage/bugs metadata, public access configuration при необходимости и явный пакетный scope publishable files. Это трактуется как часть release contract, а не как документационный довесок.

Почему так:
- Без этого пакет либо не должен публиковаться, либо будет плохо представлен в registry.
- Такие поля дешевле проверить заранее, чем исправлять после первой публикации.

Альтернативы:
- Публиковать с минимальным manifest и дополнять потом: быстрее, но повышает риск кривого первого impression и технического долга.

## Risks / Trade-offs

- [Risk] Tarball smoke test окажется хрупким из-за временных директорий и системных различий -> Mitigation: проверять минимальный инвариант запуска CLI и наличия runtime assets, без лишней среды и сетевых шагов.
- [Risk] GitHub Actions publish получит другой набор шагов, чем локальный release-check -> Mitigation: свести publish workflow к вызову тех же repo-level scripts и tarball smoke verification.
- [Risk] Ошибка в trusted publishing setup или GitHub Actions permissions заблокирует publish несмотря на готовый пакет -> Mitigation: документировать required OIDC/trusted-publishing setup и отделить verify jobs от финального publish step.

## Migration Plan

Изменение additive: обновляются metadata и release tooling вокруг существующего пакета, плюс добавляется GitHub Actions workflow. Перед первым реальным publish выполняется локальный release-check и tarball smoke test; GitHub Actions publish по `workflow_dispatch` использует те же проверки перед публикацией через trusted publishing. Rollback после внедрения change — откат metadata/scripts/tests/workflow. Rollback после фактического npm release вне scope и потребует отдельной registry-стратегии (`deprecate`, patch release или unpublish в допустимое окно).

## Open Questions

- Открытых вопросов нет.
