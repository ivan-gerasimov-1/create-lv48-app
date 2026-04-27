import type { TGenerationContext } from "#/generate/types";

export interface ITransformPipeline {
  mapDestinationPath(relativePath: string): string;
  transformTextFile(relativePath: string, fileContents: string): string;
}
