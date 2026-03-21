import path from 'node:path';

const SPECIAL_FILE_NAMES = new Map<string, string>([
  ['_gitignore', '.gitignore'],
  ['_npmrc', '.npmrc'],
]);

export function renameSpecialTemplatePath(relativePath: string): string {
  let segments = relativePath.split(path.sep);
  let renamedSegments = segments.map((segment) => SPECIAL_FILE_NAMES.get(segment) ?? segment);
  return path.join(...renamedSegments);
}
