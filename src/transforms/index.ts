import type { GenerationContext } from '../generate/types.js';
import { transformPackageJson } from './packageJson.js';
import { interpolatePlaceholders } from './placeholders.js';
import { renameSpecialTemplatePath } from './renameSpecialFiles.js';

export type TransformPipeline = {
  mode: 'staged';
  mapDestinationPath(relativePath: string): string;
  transformTextFile(relativePath: string, fileContents: string, context: GenerationContext): string;
};

export function createTransformPipeline(): TransformPipeline {
  return {
    mode: 'staged',
    mapDestinationPath(relativePath) {
      return renameSpecialTemplatePath(relativePath);
    },
    transformTextFile(relativePath, fileContents, context) {
      const interpolatedContents = interpolatePlaceholders(fileContents, context.placeholders);

      if (relativePath.endsWith('package.json')) {
        return transformPackageJson(relativePath, interpolatedContents, context);
      }

      return interpolatedContents;
    },
  };
}
