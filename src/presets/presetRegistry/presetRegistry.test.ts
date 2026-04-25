import { describe, it, expect } from "vitest";

import type { TPresetMetadata } from "#/presets/types";

import { PresetRegistry } from "./presetRegistry";

describe("PresetRegistry", () => {
  it("get() returns base preset by default", () => {
    let registry = new PresetRegistry();
    let preset = registry.get();
    expect(preset).toHaveProperty("name", "base");
  });

  it("get('base') returns base preset", () => {
    let registry = new PresetRegistry();
    let preset = registry.get("base");
    expect(preset).toHaveProperty("name", "base");
  });

  it("get('unknown') throws unknown preset error", () => {
    let registry = new PresetRegistry();
    expect(() => registry.get("unknown")).toThrow("Unknown preset: unknown");
  });

  it("register stores and retrieves custom preset", () => {
    let registry = new PresetRegistry();
    let customPreset = {
      name: "custom" as const,
      displayName: "Custom Preset",
      description: "A custom preset",
      packageManagers: ["npm"] as const,
      reservedDirectories: [],
      placeholderKeys: [],
      postGeneration: {
        installDependencies: false,
        initializeGit: false,
      },
    };
    registry.register(customPreset as unknown as TPresetMetadata);
    let retrieved = registry.get("custom");
    expect(retrieved.name).toBe("custom");
  });
});
