import type { TResult } from "#/utils/either/types";

export interface ITransformPipeline {
  mapDestinationPath(relativePath: string): string;
  transformTextFile(
    relativePath: string,
    fileContents: string,
  ): TResult<string>;
}
