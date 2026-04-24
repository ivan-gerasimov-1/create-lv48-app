import type { TGenerationContext } from "../generate/types";

export type TTransformPipeline = {
  mapDestinationPath(relativePath: string, context: TGenerationContext): string;
  transformTextFile(
    relativePath: string,
    fileContents: string,
    context: TGenerationContext,
  ): string;
};
