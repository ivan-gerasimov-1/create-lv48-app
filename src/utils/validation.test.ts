import { describe, it, expect } from "vitest";

import { validateName, validateTargetDirectory } from "./validation";

describe("validation", () => {
  it("validates name and target directory inputs", () => {
    expect(validateName("demo-app")).toEqual({
      ok: true,
      value: "demo-app",
    });
    expect(validateTargetDirectory("apps/demo")).toEqual({
      ok: true,
      value: "apps/demo",
    });
    expect(validateName("Demo App")).toEqual({
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
