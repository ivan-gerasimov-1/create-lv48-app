import path from 'node:path';

import type { TGenerationContext } from '../generate/types.js';

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

  let nextValue = { ...parsedValue };
  let segments = relativePath.split(path.sep);

  if (relativePath === 'package.json') {
    nextValue.name = context.answers.packageName;
    nextValue.packageManager = 'npm';
  }

  if (segments[0] === 'apps' || segments[0] === 'packages') {
    let segmentName = segments[1];

    if (typeof segmentName === 'string' && segmentName.length > 0) {
      nextValue.name = `@${context.answers.packageName}/${segmentName}`;
    }
  }

  return `${JSON.stringify(nextValue, null, 2)}\n`;
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
