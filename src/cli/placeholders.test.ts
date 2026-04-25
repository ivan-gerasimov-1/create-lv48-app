import { describe, it, expect } from "vitest";

import type { TPromptAnswers } from "#/prompts/types";

import { createPlaceholderValues } from "./placeholders";

describe("placeholders", () => {
  it("creates placeholder values for single layout", () => {
    let answers: TPromptAnswers = {
      projectName: "test-app",
      packageName: "test-app",
      displayName: "Test App",
      targetDirectory: "test-dir",
      packageManager: "npm",
      presetId: "base",
      installDependencies: false,
      initializeGit: false,
      workspaceLayout: "single",
    };

    /**
     * @todo Add proper types for TPlaceholderValues in order to
     * use dot notation property access
     */
    let placeholders = createPlaceholderValues(answers);

    expect(placeholders["projectName"]).toBe("test-app");
    expect(placeholders["packageName"]).toBe("test-app");
    expect(placeholders["displayName"]).toBe("Test App");
    expect(placeholders["targetDirectory"]).toBe("test-dir");
    expect(placeholders["webPackageName"]).toBe("@test-app/web");
    expect(placeholders["sitePackageName"]).toBe("@test-app/site");
    expect(placeholders["apiPackageName"]).toBe("@test-app/api");
    expect(placeholders["webWorkspacePath"]).toBe("apps/web");
    expect(placeholders["siteWorkspacePath"]).toBe("apps/site");
    expect(placeholders["apiWorkspacePath"]).toBe("apps/api");
    expect(placeholders["workspaceLayout"]).toBe("single");
    expect(placeholders["appProjectName"]).toBe("");
  });

  it("creates placeholder values for multi layout", () => {
    let answers: TPromptAnswers = {
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
    };

    let placeholders = createPlaceholderValues(answers);

    expect(placeholders["projectName"]).toBe("test-app");
    expect(placeholders["packageName"]).toBe("test-app");
    expect(placeholders["displayName"]).toBe("Test App");
    expect(placeholders["targetDirectory"]).toBe("test-dir");
    expect(placeholders["webPackageName"]).toBe("@project-1/web");
    expect(placeholders["sitePackageName"]).toBe("@project-1/site");
    expect(placeholders["apiPackageName"]).toBe("@project-1/api");
    expect(placeholders["webWorkspacePath"]).toBe("apps/project-1/web");
    expect(placeholders["siteWorkspacePath"]).toBe("apps/project-1/site");
    expect(placeholders["apiWorkspacePath"]).toBe("apps/project-1/api");
    expect(placeholders["workspaceLayout"]).toBe("multi");
    expect(placeholders["appProjectName"]).toBe("project-1");
  });
});
