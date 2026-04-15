import { describe, it, expect } from "vitest";

import { createPromptController } from "./promptController.js";
import { createPromptIoMock } from "../../tests/createPromptIoMock.js";

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
      workspaceLayout: "single",
      appProjectName: undefined,
    });
  });

  it("collects multi-project layout answers", async () => {
    let answers = ["demo-app", "demo-directory", "multi", "project-1"];
    let confirmations = [true, false];

    let promptIo = {
      async askText() {
        let value = answers.shift();

        if (typeof value !== "string") {
          throw new Error("Missing text answer");
        }

        return value;
      },
      async askConfirm() {
        let value = confirmations.shift();

        if (typeof value !== "boolean") {
          throw new Error("Missing confirm answer");
        }

        return value;
      },
      async close() {},
    };

    let controller = createPromptController(promptIo);

    expect(await controller.collectAnswers("fallback-name")).toEqual({
      projectName: "demo-app",
      packageName: "demo-app",
      displayName: "Demo App",
      targetDirectory: "demo-directory",
      packageManager: "npm",
      presetId: "base",
      installDependencies: true,
      initializeGit: false,
      workspaceLayout: "multi",
      appProjectName: "project-1",
    });
  });
});
