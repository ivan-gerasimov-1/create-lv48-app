import { describe, it, expect } from "vitest";

import { createTransformPipeline } from "./index.js";
import type { TGenerationContext } from "../generate/types.js";

describe("transforms", () => {
  it("maps destination paths for single layout", () => {
    let pipeline = createTransformPipeline();
    let context: TGenerationContext = {
      cwd: "/test",
      templateBaseDirectory: "/test/templates",
      targetRoot: "/test/target",
      answers: {
        projectName: "test-app",
        packageName: "test-app",
        displayName: "Test App",
        targetDirectory: "test-dir",
        packageManager: "npm",
        presetId: "base",
        installDependencies: false,
        initializeGit: false,
        workspaceLayout: "single",
      },
      preset: {
        id: "base",
        displayName: "Base",
        description: "Base preset",
        templateDirectory: "templates/base",
        packageManagers: ["npm"],
        reservedDirectories: ["packages"],
        placeholderKeys: [],
        postGeneration: {
          installDependencies: true,
          initializeGit: true,
        },
      },
      placeholders: {},
    };

    expect(pipeline.mapDestinationPath("apps/web", context)).toBe("apps/web");
    expect(pipeline.mapDestinationPath("apps/site", context)).toBe("apps/site");
    expect(pipeline.mapDestinationPath("apps/api", context)).toBe("apps/api");
    expect(pipeline.mapDestinationPath("packages/eslint-config", context)).toBe(
      "packages/eslint-config",
    );
  });

  it("maps destination paths for multi layout", () => {
    let pipeline = createTransformPipeline();
    let context: TGenerationContext = {
      cwd: "/test",
      templateBaseDirectory: "/test/templates",
      targetRoot: "/test/target",
      answers: {
        projectName: "test-app",
        packageName: "test-app",
        displayName: "Test App",
        targetDirectory: "test-dir",
        packageManager: "npm",
        presetId: "base",
        installDependencies: false,
        initializeGit: false,
        workspaceLayout: "multi",
        appProjectName: "project-1",
      },
      preset: {
        id: "base",
        displayName: "Base",
        description: "Base preset",
        templateDirectory: "templates/base",
        packageManagers: ["npm"],
        reservedDirectories: ["packages"],
        placeholderKeys: [],
        postGeneration: {
          installDependencies: true,
          initializeGit: true,
        },
      },
      placeholders: {},
    };

    expect(pipeline.mapDestinationPath("apps/web", context)).toBe(
      "apps/project-1/web",
    );
    expect(pipeline.mapDestinationPath("apps/site", context)).toBe(
      "apps/project-1/site",
    );
    expect(pipeline.mapDestinationPath("apps/api", context)).toBe(
      "apps/project-1/api",
    );
    expect(pipeline.mapDestinationPath("packages/eslint-config", context)).toBe(
      "packages/eslint-config",
    );
  });
});
