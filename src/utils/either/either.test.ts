import { describe, expect, it } from "vitest";

import { Either } from "./either";

describe("Either", () => {
  it("constructs success values", () => {
    expect(Either.success("demo-app")).toEqual({
      ok: true,
      value: "demo-app",
    });
  });

  it("constructs failure values", () => {
    expect(Either.failure("Project name is required.")).toEqual({
      ok: false,
      reason: "Project name is required.",
    });
  });
});
