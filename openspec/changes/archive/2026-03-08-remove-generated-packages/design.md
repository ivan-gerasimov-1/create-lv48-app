## Context

Текущий `base` preset генерирует четыре starter package-модуля в `packages/`, и это поведение зашито одновременно в template assets, smoke-тесты и baseline documentation/specs. При этом сам генератор копирует только файлы из шаблона, поэтому полностью пустая директория сейчас не попадёт в output без расширения scaffold pipeline.

## Goals / Non-Goals

**Goals:**
- убрать из baseline scaffold все автоматически создаваемые shared packages;
- сохранить `packages/` в generated project как пустую директорию на будущее;
- синхронизировать тесты и документацию с новой структурой.

**Non-Goals:**
- менять состав `apps/*`;
- вводить новый preset или новую layout-стратегию;
- обязательно убирать `packages/*` из root `workspaces`, если это не требуется для корректности текущего scaffold.

## Decisions

### Preserve empty directories in the scaffold pipeline
Пустая директория `packages/` должна попадать в generated project без служебных файлов, поэтому scaffold pipeline нужно расширить так, чтобы он учитывал директории из шаблона, а не только файлы.

Alternative considered:
- сохранить `packages/` через `.gitkeep` или другой marker file;
- почему не выбрано: пользовательский scaffold получает лишний служебный файл, который не несёт пользы в новом проекте.

### Limit the behavioral change to the base preset contract
Изменение должно быть локализовано в `templates/base`, smoke-тестах baseline scaffold и spec/docs, описывающих контракт preset.

Alternative considered:
- параллельно пересобрать генератор, naming rules или placeholder pipeline;
- почему не выбрано: это не решает пользовательскую проблему и увеличивает риск лишних регрессий.

### Preserve reversibility in root workspace configuration
Если после удаления generated packages root `package.json` с `packages/*` остаётся валидным и не ломает bootstrap flow, его можно оставить без изменения как подготовку к будущим shared workspaces.

Alternative considered:
- сразу убрать `packages/*` из `workspaces`;
- почему не выбрано: это сильнее меняет baseline contract и усложняет будущий возврат shared packages.

## Risks / Trade-offs

- `[Behavior drift]` README, tests и spec могут разъехаться с template structure -> обновить их в одном change и проверять scaffold smoke-тестом.
- `[Hidden coupling]` где-то могут остаться жёсткие ожидания путей `packages/config|ui|types|utils` -> сделать repo-wide search и убрать все живые ссылки.
- `[Pipeline complexity]` поддержка пустых директорий немного расширит логику generation runner -> ограничить change только корректным созданием template directories без новых абстракций.

## Migration Plan

1. Обновить OpenSpec delta для `preset-project-scaffolding`.
2. Удалить package template assets и добавить поддержку копирования пустых директорий из template tree.
3. Переписать smoke-тест baseline scaffold под пустую директорию.
4. Обновить README/spec/docs под новый contract.
5. Прогнать тесты и build/typecheck затронутого модуля.

Rollback strategy: вернуть удалённые template assets, откатить поддержку пустых директорий в generator и прежние ожидания в tests/spec/docs. Изменение обратимое, без миграций данных.

## Open Questions

- Нужна ли отдельная правка root `workspaces`, или для первой итерации достаточно оставить `packages/*` как forward-compatible конфигурацию?
