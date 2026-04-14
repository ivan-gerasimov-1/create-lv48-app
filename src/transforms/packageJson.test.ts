import { describe, it, expect } from "vitest";

import { transformPackageJson } from "./packageJson.js";
import type { TGenerationContext } from "../generate/types.js";

describe("transformPackageJson", () => {
  it("transforms root package.json for single layout", () => {
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

    let input = JSON.stringify({
      name: "{{packageName}}",
      private: true,
      version: "0.1.0",
      workspaces: ["apps/*", "packages/*"],
    });

    let result = transformPackageJson("package.json", input, context);
    let parsed = JSON.parse(result);

    expect(parsed.name).toBe("test-app");
    expect(parsed.packageManager).toBe("npm");
    expect(parsed.workspaces).toEqual(["apps/*", "packages/*"]);
  });

  it("transforms root package.json for multi layout", () => {
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

    let input = JSON.stringify({
      name: "{{packageName}}",
      private: true,
      version: "0.1.0",
      workspaces: ["apps/*", "packages/*"],
    });

    let result = transformPackageJson("package.json", input, context);
    let parsed = JSON.parse(result);

    expect(parsed.name).toBe("test-app");
    expect(parsed.packageManager).toBe("npm");
    expect(parsed.workspaces).toEqual(["apps/*/*", "packages/*"]);
  });

  it("transforms app package.json for single layout", () => {
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

    let input = JSON.stringify({
      name: "@{{packageName}}/web",
      private: true,
      version: "0.1.0",
    });

    let result = transformPackageJson("apps/web/package.json", input, context);
    let parsed = JSON.parse(result);

    expect(parsed.name).toBe("@test-app/web");
  });

  it("transforms app package.json for multi layout", () => {
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

    let input = JSON.stringify({
      name: "@{{packageName}}/web",
      private: true,
      version: "0.1.0",
    });

    let result = transformPackageJson(
      "apps/project-1/web/package.json",
      input,
      context,
    );
    let parsed = JSON.parse(result);

    expect(parsed.name).toBe("@project-1/web");
  });

  it("transforms shared package.json for both layouts", () => {
    let singleContext: TGenerationContext = {
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

    let multiContext: TGenerationContext = {
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

    let input = JSON.stringify({
      name: "@{{packageName}}/eslint-config",
      private: true,
      version: "0.1.0",
    });

    let singleResult = transformPackageJson(
      "packages/eslint-config/package.json",
      input,
      singleContext,
    );
    let multiResult = transformPackageJson(
      "packages/eslint-config/package.json",
      input,
      multiContext,
    );

    expect(JSON.parse(singleResult).name).toBe("@test-app/eslint-config");
    expect(JSON.parse(multiResult).name).toBe("@test-app/eslint-config");
  });
});
