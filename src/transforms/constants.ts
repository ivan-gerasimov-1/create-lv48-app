export const APPS_PATH_PREFIX = "apps/";
export const PACKAGES_PATH_PREFIX = "packages/";
export const APPS_DIRECTORY = "apps";
export const PACKAGES_DIRECTORY = "packages";
export const PACKAGE_JSON_FILE_NAME = "package.json";
export const PACKAGE_MANAGER_NPM = "npm";
export const WORKSPACE_GLOB_APPS_MULTI = "apps/*/*";
export const WORKSPACE_GLOB_PACKAGES = "packages/*";
export const WORKSPACE_GLOB_APPS_SINGLE = "apps/*";

export const PLACEHOLDER_PATTERN = /\{\{([a-zA-Z0-9]+)\}\}/g;

export const SPECIAL_FILE_NAMES = new Map<string, string>([
  ["_gitignore", ".gitignore"],
  ["_npmrc", ".npmrc"],
]);
