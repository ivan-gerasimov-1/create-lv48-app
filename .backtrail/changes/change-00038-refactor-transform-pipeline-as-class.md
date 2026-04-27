# CHANGE-00038: Refactor transform pipeline as class

| Status   | Date       | ADRs |
| -------- | ---------- | ---- |
| Proposed | 2026-04-27 | -    |

## Goal

Refactor transform orchestration from a factory-created object into an explicit `TransformPipeline` class while preserving current destination path mapping and text transform behavior.

## Scope

Included:

- Rename `TTransformPipeline` to `ITransformPipeline` and convert it to an interface.
- Replace `createTransformPipeline(...)` with direct `TransformPipeline` construction.
- Pass `TGenerationContext` to the `TransformPipeline` constructor and store it as `private readonly context`.
- Move public transform behavior into class methods, with only externally required methods marked `public`.
- Move `mapMultiProjectPath(...)` into a private class method.
- Move JSON object checking into a reusable utility module.
- Move transform constant values into a separate constants file.
- Update call sites so transform methods no longer receive context per invocation.
- Add or update focused tests that preserve current path mapping and package.json transform behavior.

Excluded:

- Converting transform failures to `Either`; that is sequenced in CHANGE-00039.
- Changing generated file names, workspace layout behavior, package naming rules, placeholder interpolation semantics, or rollback behavior.
- Adding new transform responsibilities beyond preserving current behavior.

## Implementation

1. Convert `src/transforms/types.ts` from `TTransformPipeline` type alias to `ITransformPipeline` interface.
2. Add a `TransformPipeline` class in `src/transforms/transformPipeline.ts` with `private readonly context`.
3. Remove `createTransformPipeline(...)` and instantiate `TransformPipeline` directly from the CLI after generation context inputs are available.
4. Update `GenerationRunner` to use `ITransformPipeline` and call transform methods without passing context.
5. Move `mapMultiProjectPath(...)` into `TransformPipeline` as a private method with explicit visibility.
6. Move repeated literals such as special path prefixes, package.json file name, package manager, and workspace globs into `src/transforms/constants.ts`.
7. Move `isJsonObject(...)` from `src/transforms/packageJson.ts` to a utility module and update imports.
8. Update tests and imports affected by the class conversion and interface rename.

## Verification

Run:

```bash
npm run test
npm run build
```

Expected result:

- Existing scaffold output remains unchanged.
- TypeScript compiles with explicit class visibility modifiers.
- Transform path mapping and package.json transform tests pass.
- Full test suite passes.

## Rollback

Restore `TTransformPipeline`, `createTransformPipeline(...)`, context-per-call transform methods, local `mapMultiProjectPath(...)`, and local `isJsonObject(...)`. Revert related imports, constants, and tests if no downstream change has adopted `TransformPipeline`.
