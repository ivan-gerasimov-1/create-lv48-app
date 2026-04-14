import { describe, it, expect } from "vitest";

import { createPromptController } from "./index.js";
import { createPromptIoMock } from "../../tests/helpers.js";

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
});
