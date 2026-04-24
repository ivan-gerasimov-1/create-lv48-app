import type { TGenerationContext } from "../generate/types";
import { transformPackageJson } from "./packageJson";
import { interpolatePlaceholders } from "./placeholders";
import { renameSpecialTemplatePath } from "./renameSpecialFiles";
import type { TTransformPipeline } from "./types";

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
