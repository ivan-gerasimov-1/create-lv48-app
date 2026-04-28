import { describe, expect, it } from "vitest";

import type { TGenerationContext } from "#/generate/types";
import type { TPresetMetadata } from "#/presets/types";

import { TransformPipeline } from "./transformPipeline";

function createContext(
  overrides: Partial<TGenerationContext["answers"]> = {},
): TGenerationContext {
  let preset: TPresetMetadata = {
    name: "base",
    displayName: "Base Template",
    description: "Base template description",
    packageManagers: ["npm"],
    placeholderKeys: [],
    postGeneration: {
      installDependencies: true,
      initializeGit: true,
    },
  };

  return {
    cwd: "/tmp",
    filesRoot: "/tmp/files",
    targetRoot: "/tmp/target",
    answers: {
      projectName: "test-app",
      packageName: "test-app",
      displayName: "Test App",
      targetDirectory: "test-app",
      packageManager: "npm",
      presetId: "base",
      installDependencies: false,
      initializeGit: false,
      workspaceLayout: "single",
      ...overrides,
    },
    preset,
    placeholders: {
      projectName: "test-app",
    },
  };
}

describe("TransformPipeline", () => {
  describe("transformTextFile", () => {
    it("interpolates placeholders successfully", () => {
      let pipeline = new TransformPipeline(createContext());
      let result = pipeline.transformTextFile("readme.md", "# {{projectName}}");

      expect(result.ok).toBe(true);
      expect(result.ok && result.value).toBe("# test-app");
    });

    it("returns failure for unresolved placeholders", () => {
      let pipeline = new TransformPipeline(createContext());
      let result = pipeline.transformTextFile("readme.md", "# {{missingKey}}");

      expect(result.ok).toBe(false);
      expect(result.ok === false && result.reason).toBe(
        "Unresolved placeholder: {{missingKey}}",
      );
    });

    it("transforms root package.json for single workspace layout", () => {
      let pipeline = new TransformPipeline(createContext());
      let result = pipeline.transformTextFile(
        "package.json",
        JSON.stringify({ name: "old-name", version: "1.0.0" }),
      );

      expect(result.ok).toBe(true);

      if (result.ok) {
        let parsed = JSON.parse(result.value);
        expect(parsed.name).toBe("test-app");
        expect(parsed.packageManager).toBe("npm");
        expect(parsed.workspaces).toEqual(["apps/*", "packages/*"]);
      }
    });

    it("transforms root package.json for multi workspace layout", () => {
      let pipeline = new TransformPipeline(
        createContext({
          workspaceLayout: "multi",
          appProjectName: "project-1",
        }),
      );
      let result = pipeline.transformTextFile(
        "package.json",
        JSON.stringify({ name: "old-name", version: "1.0.0" }),
      );

      expect(result.ok).toBe(true);

      if (result.ok) {
        let parsed = JSON.parse(result.value);
        expect(parsed.name).toBe("test-app");
        expect(parsed.packageManager).toBe("npm");
        expect(parsed.workspaces).toEqual(["apps/*/*", "packages/*"]);
      }
    });

    it("returns failure for invalid package.json JSON", () => {
      let pipeline = new TransformPipeline(createContext());
      let result = pipeline.transformTextFile("package.json", "not valid json");

      expect(result.ok).toBe(false);
      expect(result.ok === false && result.reason).toMatch(
        /Failed to parse package\.json template at package\.json:/,
      );
    });

    it("returns failure for package.json that parses to a non-object", () => {
      let pipeline = new TransformPipeline(createContext());
      let result = pipeline.transformTextFile(
        "package.json",
        JSON.stringify([1, 2, 3]),
      );

      expect(result.ok).toBe(false);
      expect(result.ok === false && result.reason).toBe(
        "Invalid package.json template at package.json",
      );
    });
  });

  describe("mapDestinationPath", () => {
    it("renames special template file names", () => {
      let pipeline = new TransformPipeline(createContext());
      let result = pipeline.mapDestinationPath("_gitignore");

      expect(result).toBe(".gitignore");
    });

    it("maps multi-project app paths when appProjectName is set", () => {
      let pipeline = new TransformPipeline(
        createContext({
          workspaceLayout: "multi",
          appProjectName: "project-1",
        }),
      );
      let result = pipeline.mapDestinationPath("apps/web/package.json");

      expect(result).toBe("apps/project-1/web/package.json");
    });

    it("does not remap paths for single workspace layout", () => {
      let pipeline = new TransformPipeline(createContext());
      let result = pipeline.mapDestinationPath("apps/web/package.json");

      expect(result).toBe("apps/web/package.json");
    });
  });
});
