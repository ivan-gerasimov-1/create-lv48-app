import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    "create-lv48-app": "src/main.ts",
  },
  platform: "node",
  fixedExtension: false,
  minify: true,
  sourcemap: true,
  outDir: "bin",
});
