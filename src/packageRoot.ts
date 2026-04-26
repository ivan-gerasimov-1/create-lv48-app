import path from "node:path";

export const PACKAGE_ROOT = path.resolve(import.meta.dirname, "..");
export const TEMPLATES_ROOT = path.resolve(PACKAGE_ROOT, "templates");

export async function getPackageVersion(): Promise<string> {
  let packageJsonPath = path.resolve(PACKAGE_ROOT, "package.json");
  let packageJson = await import(packageJsonPath, {
    with: { type: "json" },
  });
  return packageJson.default.version;
}
