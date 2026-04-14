import type { TGenerationContext } from "../generate/types.js";
import { transformPackageJson } from "./packageJson.js";
import { interpolatePlaceholders } from "./placeholders.js";
import { renameSpecialTemplatePath } from "./renameSpecialFiles.js";

export type TTransformPipeline = {
  mapDestinationPath(relativePath: string, context: TGenerationContext): string;
  transformTextFile(
    relativePath: string,
    fileContents: string,
    context: TGenerationContext,
  ): string;
};

export function createTransformPipeline(): TTransformPipeline {
  return {
    mapDestinationPath(relativePath, context) {
      let renamedPath = renameSpecialTemplatePath(relativePath);

      if (
        context.answers.workspaceLayout === "multi" &&
        context.answers.appProjectName
      ) {
        return mapMultiProjectPath(renamedPath, context.answers.appProjectName);
      }

      return renamedPath;
    },
    transformTextFile(relativePath, fileContents, context) {
      let interpolatedContents = interpolatePlaceholders(
        fileContents,
        context.placeholders,
      );

      if (relativePath.endsWith("package.json")) {
        return transformPackageJson(
          relativePath,
          interpolatedContents,
          context,
        );
      }

      return interpolatedContents;
    },
  };
}

function mapMultiProjectPath(
  relativePath: string,
  appProjectName: string,
): string {
  if (relativePath.startsWith("apps/")) {
    let pathWithoutApps = relativePath.slice(5);
    return `apps/${appProjectName}/${pathWithoutApps}`;
  }

  return relativePath;
}
