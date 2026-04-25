import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/main.ts"],
  platform: "node",
  fixedExtension: false,
  minify: true,
  sourcemap: true,
});
