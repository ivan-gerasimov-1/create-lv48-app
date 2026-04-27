import path from "node:path";

import { isJsonObject } from "#/utils/json";
import type { TGenerationContext, TPlaceholderValues } from "#/generate/types";
import type { ITransformPipeline } from "./types";
import {
  APPS_DIRECTORY,
  APPS_PATH_PREFIX,
  PACKAGES_DIRECTORY,
  PACKAGE_JSON_FILE_NAME,
  PACKAGE_MANAGER_NPM,
  PLACEHOLDER_PATTERN,
  SPECIAL_FILE_NAMES,
  WORKSPACE_GLOB_APPS_MULTI,
  WORKSPACE_GLOB_APPS_SINGLE,
  WORKSPACE_GLOB_PACKAGES,
} from "./constants";

export class TransformPipeline implements ITransformPipeline {
  public constructor(private readonly context: TGenerationContext) {}

  public mapDestinationPath(relativePath: string): string {
    let renamedPath = this.renameSpecialTemplatePath(relativePath);

    if (
      this.context.answers.workspaceLayout === "multi" &&
      this.context.answers.appProjectName
    ) {
      return this.mapMultiProjectPath(
        renamedPath,
        this.context.answers.appProjectName,
      );
    }

    return renamedPath;
  }

  public transformTextFile(relativePath: string, fileContents: string): string {
    let interpolatedContents = this.interpolatePlaceholders(
      fileContents,
      this.context.placeholders,
    );

    if (relativePath.endsWith(PACKAGE_JSON_FILE_NAME)) {
      return this.transformPackageJson(relativePath, interpolatedContents);
    }

    return interpolatedContents;
  }

  private mapMultiProjectPath(
    relativePath: string,
    appProjectName: string,
  ): string {
    if (relativePath.startsWith(APPS_PATH_PREFIX)) {
      let pathWithoutApps = relativePath.slice(APPS_PATH_PREFIX.length);
      return `${APPS_PATH_PREFIX}${appProjectName}/${pathWithoutApps}`;
    }

    return relativePath;
  }

  private transformPackageJson(
    relativePath: string,
    fileContents: string,
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

    if (relativePath === PACKAGE_JSON_FILE_NAME) {
      nextValue["name"] = this.context.answers.packageName;
      nextValue["packageManager"] = PACKAGE_MANAGER_NPM;

      if (this.context.answers.workspaceLayout === "multi") {
        nextValue["workspaces"] = [
          WORKSPACE_GLOB_APPS_MULTI,
          WORKSPACE_GLOB_PACKAGES,
        ];
      } else {
        nextValue["workspaces"] = [
          WORKSPACE_GLOB_APPS_SINGLE,
          WORKSPACE_GLOB_PACKAGES,
        ];
      }
    }

    if (segments[0] === APPS_DIRECTORY) {
      if (
        this.context.answers.workspaceLayout === "multi" &&
        this.context.answers.appProjectName
      ) {
        let workspaceName = segments[2];

        if (typeof workspaceName === "string" && workspaceName.length > 0) {
          nextValue["name"] =
            `@${this.context.answers.appProjectName}/${workspaceName}`;
        }
      } else {
        let workspaceName = segments[1];

        if (typeof workspaceName === "string" && workspaceName.length > 0) {
          nextValue["name"] =
            `@${this.context.answers.packageName}/${workspaceName}`;
        }
      }
    }

    if (segments[0] === PACKAGES_DIRECTORY) {
      let packageName = segments[1];

      if (typeof packageName === "string" && packageName.length > 0) {
        nextValue["name"] =
          `@${this.context.answers.packageName}/${packageName}`;
      }
    }

    return `${JSON.stringify(nextValue, null, 2)}\n`;
  }

  private interpolatePlaceholders(
    templateContents: string,
    placeholders: TPlaceholderValues,
  ): string {
    return templateContents.replace(
      PLACEHOLDER_PATTERN,
      (_match, rawKey: string) => {
        let value = placeholders[rawKey];

        if (value === undefined) {
          throw new Error(`Unresolved placeholder: {{${rawKey}}}`);
        }

        return value;
      },
    );
  }

  private renameSpecialTemplatePath(relativePath: string): string {
    let segments = relativePath.split(path.sep);
    let renamedSegments = segments.map(
      (segment) => SPECIAL_FILE_NAMES.get(segment) ?? segment,
    );
    return path.join(...renamedSegments);
  }
}
