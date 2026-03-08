## Context

CLI уже выполняет optional post-setup шаг `git init` после успешной генерации scaffold. Сейчас команда запускается без явного branch override, поэтому итоговая initial branch зависит от локальной версии и конфигурации Git. Требование change узкое: только новые репозитории, только в initializer flow, без вмешательства в глобальный Git config и без destructive действий над существующими проектами.

## Goals / Non-Goals

**Goals:**
- Обеспечить branch `main` для репозитория, созданного через optional `git init` в generated project.
- Сохранить текущее reversible-first поведение: scaffold остаётся на месте, если optional git step завершился ошибкой.
- Сохранить совместимость с разными версиями Git без расширения UX surface.

**Non-Goals:**
- Переименование branch в уже существующих репозиториях.
- Любые изменения prompt flow, final summary semantics или dependency installation.

## Decisions

### 1. Зафиксировать `main` на уровне post-setup executor, а не через документацию или окружение

`createPostSetupExecutor` останется единственной точкой, которая отвечает за git initialization. Логика выбора branch не должна утекать в prompts, templates или summary builder.

Почему так:
- Поведение остаётся локализованным в месте, где уже исполняется `git init`.
- Это минимальное изменение контракта без новых слоёв и без скрытой зависимости от пользовательского окружения.

Альтернативы:
- Положиться на `git config --global init.defaultBranch main`: недостаточно надёжно и меняет машину пользователя вне scope.
- Обновить только документацию: не решает проблему поведения.

### 2. Использовать совместимую стратегию `main`-first с fallback для старых Git

Предпочтительная команда для инициализации: `git init --initial-branch=main`. Если Git не поддерживает этот флаг, executor должен откатиться к совместимому пути: обычный `git init`, затем явное переименование unborn branch в `main`.

Почему так:
- Новый Git получает прямой и читаемый happy path.
- Старый Git не ломает initializer и всё равно приводит репозиторий к нужному branch contract.

Альтернативы:
- Всегда делать только `git init -b main`: короче, но совместимость зависит от версии Git так же, как и у `--initial-branch`.
- Всегда делать двухшаговый `git init` + rename: совместимо, но теряет более прямой путь для современных версий и усложняет командный лог без причины.

### 3. Расширить unit tests на командную последовательность, а не на внутренние детали реализации

Тесты для `createPostSetupExecutor` должны проверять, какие git-команды вызываются в happy path и fallback path, а также что detail/status остаются согласованными с текущей summary model.

Почему так:
- Это соответствует проектному правилу тестировать поведение, а не implementation details.
- Командная последовательность и итоговый status являются внешним контрактом executor.

Альтернативы:
- Проверять только текст summary: слишком косвенно, не ловит regressions в git orchestration.

## Risks / Trade-offs

- [Risk] Старый Git может вернуть ошибку, которую сложно отличить от других причин отказа флага `--initial-branch` -> Mitigation: fallback применять только для распознанной unsupported-flag ошибки, остальные ошибки пробрасывать как failure optional step.
- [Risk] Двухшаговый fallback меняет число исполняемых git-команд -> Mitigation: зафиксировать последовательность в unit tests и сохранить единый user-facing status для initializeGit.
- [Risk] Разные платформы могут формулировать stderr Git по-разному -> Mitigation: держать detection правила минимальными и покрыть тестами ожидаемые error shapes, используемые executor abstraction.

## Migration Plan

Изменение additive и локальное: обновляется только поведение optional git initialization для новых scaffold runs. Rollback сводится к откату executor/test изменений; уже созданные пользовательские репозитории не модифицируются автоматически и остаются вне scope.

## Open Questions

На этапе планирования открытых вопросов нет.
