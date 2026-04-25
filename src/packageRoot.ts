import path from "node:path";

export const PACKAGE_ROOT = path.resolve(import.meta.dirname, "..");
export const TEMPLATES_ROOT = path.resolve(PACKAGE_ROOT, "templates");
