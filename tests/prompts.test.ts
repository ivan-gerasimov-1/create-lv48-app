import { describe, it, expect } from "vitest";

import { createPromptController } from "../src/prompts/index.js";
import {
  validatePackageName,
  validateProjectName,
  validateTargetDirectory,
} from "../src/utils/validation.js";
import { createPromptIoMock } from "./helpers.js";

describe("prompts", () => {
  it("collects phase 1 prompt answers without package manager or preset prompts", async () => {
    let controller = createPromptController(createPromptIoMock());

    expect(await controller.collectAnswers("fallback-name")).toEqual({
      projectName: "demo-app",
      packageName: "demo-app",
      displayName: "Demo App",
      targetDirectory: "demo-directory",
      packageManager: "npm",
      presetId: "base",
      installDependencies: true,
      initializeGit: false,
    });
  });

  it("validates project, package, and target directory inputs", () => {
    expect(validateProjectName("demo-app")).toEqual({
      ok: true,
      value: "demo-app",
    });
    expect(validatePackageName("demo-app")).toEqual({
      ok: true,
      value: "demo-app",
    });
    expect(validateTargetDirectory("apps/demo")).toEqual({
      ok: true,
      value: "apps/demo",
    });
    expect(validateProjectName("Demo App")).toEqual({
      ok: false,
      reason:
        "Project name must use lowercase letters, numbers, and single hyphens only.",
    });
    expect(validateTargetDirectory("../demo")).toEqual({
      ok: false,
      reason:
        "Target directory must stay within the current working directory.",
    });
  });
});
