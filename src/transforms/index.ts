import type { TGenerationContext } from '../generate/types.js';
import { transformPackageJson } from './packageJson.js';
import { interpolatePlaceholders } from './placeholders.js';
import { renameSpecialTemplatePath } from './renameSpecialFiles.js';

export type TTransformPipeline = {
  mapDestinationPath(relativePath: string): string;
  transformTextFile(relativePath: string, fileContents: string, context: TGenerationContext): string;
};

export function createTransformPipeline(): TTransformPipeline {
  return {
    mapDestinationPath(relativePath) {
      return renameSpecialTemplatePath(relativePath);
    },
    transformTextFile(relativePath, fileContents, context) {
      let interpolatedContents = interpolatePlaceholders(fileContents, context.placeholders);

      if (relativePath.endsWith('package.json')) {
        return transformPackageJson(relativePath, interpolatedContents, context);
      }

      return interpolatedContents;
    },
  };
}
