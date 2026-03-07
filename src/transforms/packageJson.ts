import type { GenerationContext } from '../generate/types.js';

export function transformPackageJson(
  relativePath: string,
  fileContents: string,
  context: GenerationContext,
): string {
  const parsedValue = JSON.parse(fileContents);

  if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
    throw new Error(`Invalid package.json template at ${relativePath}`);
  }

  const nextValue = { ...parsedValue };

  if (relativePath === 'package.json') {
    nextValue.name = context.answers.packageName;
    nextValue.packageManager = 'npm';
  }

  if (relativePath.startsWith(`apps/`) || relativePath.startsWith(`packages/`)) {
    const segmentName = relativePath.split('/')[1];

    if (typeof segmentName === 'string' && segmentName.length > 0) {
      nextValue.name = `@${context.answers.packageName}/${segmentName}`;
    }
  }

  return `${JSON.stringify(nextValue, null, 2)}\n`;
}
