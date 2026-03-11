## Context

В репозитории уже работает changesets-driven release pipeline, но он добавляет отдельную сущность managed changeset-файлов и свой локальный contract поверх PR labels. Если цель действительно свести release flow к понятной модели "история изменений -> release PR -> publish", то `release-please` ближе к этому сценарию: он строит release PR и changelog из conventional commits и не требует отдельного слоя changeset-файлов.

## Goals / Non-Goals

**Goals:**
- Убрать managed changeset-файлы и ручной release-intent layer из обычного PR flow.
- Перевести release orchestration на `release-please`, сохранив release PR и publish contract.
- Сделать release intent понятным из conventional commits и проверяемым до merge.
- Оставить change обратимым без смены публикационного стека.

**Non-Goals:**
- Перестройка collaboration model на прямые push'и в `main`.
- Переход на `semantic-release` или другую commit-driven release систему кроме `release-please`.
- Изменение существующих build, test, pack и publish gates.

## Decisions

### 1. Не вводить долгоживущую `release` branch

Release orchestration остаётся на `main`: `release-please` читает merged history default branch и обновляет release PR оттуда. Отдельная `release` branch добавила бы вторую линию интеграции, branch protection и отдельную логику синхронизации без явной пользы для single-package npm release.

Почему так:
- меньше operational surface и меньше путаницы, откуда именно рождается релиз;
- сохраняется совместимость с уже принятым release PR flow.

Альтернативы:
- `release` branch + `release-please`: жизнеспособно, но без нужды усложняет merge discipline;
- публикация прямо из `main` без release PR: проще mechanically, но хуже reviewability и rollback visibility.

### 2. Release intent выражается через conventional commits

Source of truth для semver становится conventional commit contract. Для squash merge это означает строгий контроль итогового merge title; для rebase/merge commits это означает контроль commit messages. Базовое отображение остаётся стандартным: `fix` -> `patch`, `feat` -> `minor`, `!` или `BREAKING CHANGE` -> `major`, service-типы могут быть настроены как non-releasing.

Почему так:
- release intent живёт в том же месте, откуда потом строится changelog;
- `release-please` использует этот контракт нативно, без собственного слоя генерации changeset-файлов.

Альтернативы:
- оставить labels + generated changesets: уже работает, но сохраняет лишнюю промежуточную сущность;
- вычислять bump по diff: слишком хрупко и плохо объяснимо.

### 3. CI валидирует conventional contract до merge

CI должен явно падать, если merge title или commit message не соответствует документированному Conventional Commit contract. Отдельный per-PR generated file больше не нужен; release aggregation делает `release-please` по истории `main`.

Почему так:
- ошибка видна до merge, а не во время релиза;
- исчезает целый класс конфликтов вокруг managed release artifacts в feature branches.

Альтернативы:
- тихо пропускать неизвестные commit patterns: ведёт к пропущенным релизам;
- оставлять ручной override без явного policy: затрудняет дебаг semver-решений.

### 4. Миграция удаляет все runtime и documentation traces `changesets`

Этот change должен не только добавить `release-please`, но и полностью вывести `changesets` из репозитория: зависимости, `.changeset/` assets, PR sync workflow, release-intent scripts/config, тестовые ожидания и документацию. В репозитории не должно остаться второго конкурирующего release contract.

Почему так:
- partial migration оставит два источника правды и повысит риск ошибочного релиза;
- документация должна описывать ровно один актуальный путь.

Альтернативы:
- оставить `changesets` как fallback: создаёт двусмысленность и удваивает поддержку;
- удалить только workflow, но оставить docs/config: быстро ломает доверие к release process.

### 5. Publish contract не меняется

`release-please` создаёт release PR, а publish workflow по-прежнему должен публиковать только после merge release commit в `main` через существующий repository publish script и текущие release gates.

Почему так:
- меньше риск побочного regressions в high-risk release зоне;
- существующие `release:check`, pack verification и smoke coverage остаются source of truth.

Альтернативы:
- публиковать напрямую через стандартный action step без repo script: проще, но даёт drift от локального проверенного release path.

## Risks / Trade-offs

- [Risk] Команда будет писать неконсистентные commit messages или merge titles -> Mitigation: добавить явную CI-валидацию и описать merge policy в документации.
- [Risk] `release-please` changelog sections могут не совпасть с текущими ожиданиями по формулировкам -> Mitigation: зафиксировать конфиг категорий и проверить generated release PR в dry-run reasoning и тестах.
- [Risk] Переход снимет текущий per-PR preview будущего changeset -> Mitigation: принять trade-off ради упрощения и оставить release PR единственной review-точкой для итогового changelog.
- [Risk] В репозитории останутся старые `changesets` references в docs или config -> Mitigation: включить явный cleanup task для code, tests, `docs/PRD.md` и `docs/SRD.md`.

## Migration Plan

Изменение additive и обратимое. Сначала добавляется `release-please` config и conventional-commit validation, затем обновляется publish workflow и удаляется PR-level changeset sync automation. После этого удаляются `.changeset/` assets, `changesets` dependencies/scripts/config, тестовые ожидания и документация переводится на новый контракт, включая `docs/PRD.md` и `docs/SRD.md`. Rollback до первого релиза по новому контракту — revert workflow/config/docs и возврат к `changesets`-based flow.

## Open Questions

Нет открытых вопросов для планирования. При реализации нужно только явно выбрать enforced merge policy: squash-only с conventional PR title или проверка каждого commit message.
