import { describe, it, expect } from "vitest";

import {
  validatePackageName,
  validateProjectName,
  validateTargetDirectory,
} from "./validation.js";

describe("validation", () => {
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
