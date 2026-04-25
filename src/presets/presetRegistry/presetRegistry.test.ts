import { describe, it, expect } from "vitest";
import { PresetRegistry } from "./presetRegistry";

describe("PresetRegistry", () => {
  it("getDefaultPreset returns preset with name field", () => {
    let registry = new PresetRegistry();
    let preset = registry.getDefaultPreset();
    expect(preset).toHaveProperty("name", "base");
  });

  it("getPresetByName returns base preset for 'base'", () => {
    let registry = new PresetRegistry();
    let preset = registry.getPresetByName("base");
    expect(preset).toHaveProperty("name", "base");
  });

  it("getPresetByName throws for unknown preset", () => {
    let registry = new PresetRegistry();
    expect(() => registry.getPresetByName("unknown")).toThrow(
      "Unknown preset: unknown",
    );
  });
});
