import path from "node:path";

import { describe, expect, it } from "vitest";

import { TEMPLATES_ROOT } from "#/packageRoot";

import { defineTemplate } from "./templateDefinition";

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
      path.resolve(TEMPLATES_ROOT, "base", "files"),
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
