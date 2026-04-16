import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/cli.ts"],
  platform: "node",
  fixedExtension: false,
  minify: true,
  sourcemap: true,
  copy: [
    {
      from: "templates",
      to: "dist/",
    },
  ],
});
