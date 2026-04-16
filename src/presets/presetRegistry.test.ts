import { describe, it, expect } from "vitest";
import { createPresetRegistry } from "./presetRegistry.js";

describe("createPresetRegistry", () => {
  it("returns registry with defaultPresetName", () => {
    let registry = createPresetRegistry();
    expect(registry.defaultPresetName).toBe("base");
  });

  it("getDefaultPreset returns preset with name field", () => {
    let registry = createPresetRegistry();
    let preset = registry.getDefaultPreset();
    expect(preset).toHaveProperty("name", "base");
  });

  it("getPresetByName returns base preset for 'base'", () => {
    let registry = createPresetRegistry();
    let preset = registry.getPresetByName("base");
    expect(preset).toHaveProperty("name", "base");
  });

  it("getPresetByName throws for unknown preset", () => {
    let registry = createPresetRegistry();
    expect(() => registry.getPresetByName("unknown")).toThrow(
      "Unknown preset: unknown",
    );
  });
});
