# CHANGE-00034: Refactor generation runner as class

| Status | Date       | ADRs |
| ------ | ---------- | ---- |
| Done   | 2026-04-26 | -    |

## Goal

Refactor the generation runner from object-returning functions into an explicit TypeScript class while preserving current scaffold behavior and CLI usage.

## Scope

Included:

- Rename `TGenerationRunner` to `IGenerationRunner` and convert it from a type alias to an interface.
- Replace the current function-backed runner implementation with a class-based `GenerationRunner`.
- Remove the `createGenerationRunner(...)` factory and instantiate `GenerationRunner` directly.
- Export generation types directly from `src/generate/types.ts` without re-exporting them from `src/generate/generationRunner.ts`.
- Mark `prepare(...)` and `scaffold(...)` as `public`.
- Move `ensureTargetDirectoryIsSafe(...)` and `scaffoldTemplate(...)` into private class methods with explicit `private` modifiers.
- Move public template path filtering into a private class method.
- Update imports, exports, and tests affected by the interface rename and class implementation.

Excluded:

- Changes to template traversal, transform pipeline behavior, rollback behavior, or CLI prompt flow.
- New runner responsibilities beyond preserving the current generation orchestration.

## Implementation

1. Convert `TGenerationRunner` in `src/generate/types.ts` to `IGenerationRunner` as an interface.
2. Add a `GenerationRunner` class in `src/generate/generationRunner.ts` that stores the transform pipeline in a private property.
3. Update CLI construction to instantiate `GenerationRunner` directly.
4. Move target-directory safety and scaffolding logic into private methods on `GenerationRunner`.
5. Move public template path filtering into a private method on `GenerationRunner`.
6. Update type exports and any imports from `TGenerationRunner` to `IGenerationRunner`.

## Verification

Run:

```bash
npm run test
npm run build
```

Expected result:

- Existing generation and CLI behavior remains unchanged.
- TypeScript compiles with explicit class visibility modifiers.
- Full test suite passes.

## Rollback

Restore the previous `TGenerationRunner` type alias, object-returning `createGenerationRunner(...)`, and module exports. Revert affected import updates if no downstream code has adopted `IGenerationRunner`.
