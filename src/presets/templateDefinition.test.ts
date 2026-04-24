import { describe, it, expect } from "vitest";
import { defineTemplate } from "./templateDefinition";
import { PACKAGE_ROOT } from "../packageRoot";
import path from "node:path";

describe("defineTemplate", () => {
  it("derives filesRoot from config.name", () => {
    let template = defineTemplate({
      name: "base",
      displayName: "Test Template",
      description: "Test description",
      packageManagers: ["npm"],
      placeholderKeys: [],
      postGeneration: {
        installDependencies: true,
        initializeGit: true,
      },
    });

    expect(template.name).toBe("base");
    expect(template.filesRoot).toBe(
      path.resolve(PACKAGE_ROOT, "templates", "base", "files"),
    );
  });

  it("returns metadata with name field", () => {
    let template = defineTemplate({
      name: "base",
      displayName: "Test Template",
      description: "Test description",
      packageManagers: ["npm"],
      placeholderKeys: [],
      postGeneration: {
        installDependencies: true,
        initializeGit: true,
      },
    });

    expect(template).toHaveProperty("name", "base");
    expect(template).toHaveProperty("displayName", "Test Template");
    expect(template).toHaveProperty("description", "Test description");
  });
});
