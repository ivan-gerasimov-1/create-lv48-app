import path from "node:path";

import type { TGenerationContext } from "#/generate/types";

export function transformPackageJson(
  relativePath: string,
  fileContents: string,
  context: TGenerationContext,
): string {
  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(fileContents);
  } catch (error) {
    throw new Error(
      `Failed to parse package.json template at ${relativePath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (!isJsonObject(parsedValue)) {
    throw new Error(`Invalid package.json template at ${relativePath}`);
  }

  /**
   * @todo Add proper types for parsedValue/nextValue in order to
   * use dot notation property access
   */
  let nextValue = { ...parsedValue };
  let segments = relativePath.split(path.sep);

  if (relativePath === "package.json") {
    nextValue["name"] = context.answers.packageName;
    nextValue["packageManager"] = "npm";

    if (context.answers.workspaceLayout === "multi") {
      nextValue["workspaces"] = ["apps/*/*", "packages/*"];
    } else {
      nextValue["workspaces"] = ["apps/*", "packages/*"];
    }
  }

  if (segments[0] === "apps") {
    if (
      context.answers.workspaceLayout === "multi" &&
      context.answers.appProjectName
    ) {
      let workspaceName = segments[2];

      if (typeof workspaceName === "string" && workspaceName.length > 0) {
        nextValue["name"] =
          `@${context.answers.appProjectName}/${workspaceName}`;
      }
    } else {
      let workspaceName = segments[1];

      if (typeof workspaceName === "string" && workspaceName.length > 0) {
        nextValue["name"] = `@${context.answers.packageName}/${workspaceName}`;
      }
    }
  }

  if (segments[0] === "packages") {
    let packageName = segments[1];

    if (typeof packageName === "string" && packageName.length > 0) {
      nextValue["name"] = `@${context.answers.packageName}/${packageName}`;
    }
  }

  return `${JSON.stringify(nextValue, null, 2)}\n`;
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
