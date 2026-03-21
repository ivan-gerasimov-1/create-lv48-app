import path from 'node:path';

import { listRelativeFiles } from '../utils/fs.js';
import type { TPackedFile, TReleaseVerificationResult } from './types.js';

const STATIC_EXPECTED_PACKED_FILES = [
  'LICENSE',
  'README.md',
  'package.json',
  'bin/create-lv48-app.js',
];

const ALLOWED_TOP_LEVEL_DIRECTORIES = new Set([
  'bin',
  'dist',
  'package.json',
  'templates',
  'LICENSE',
  'README.md',
]);

export async function buildExpectedPackedFiles(repositoryRoot: string): Promise<string[]> {
  let distFiles = await listRelativeFiles(path.join(repositoryRoot, 'dist'));
  let templateFiles = await listRelativeFiles(path.join(repositoryRoot, 'templates'));

  return [
    ...STATIC_EXPECTED_PACKED_FILES,
    ...distFiles.map((f) => `dist/${f.split(path.sep).join('/')}`),
    ...templateFiles.map((f) => `templates/${f.split(path.sep).join('/')}`),
  ].sort();
}

export function verifyPackedFiles(
  files: TPackedFile[],
  expectedFiles: string[],
): TReleaseVerificationResult {
  let actualFiles = files
    .map((file) => normalizePackedPath(file.path))
    .filter((filePath) => filePath.length > 0)
    .sort();

  let actualSet = new Set(actualFiles);
  let sortedExpectedFiles = [...expectedFiles].sort();
  let missingFiles = sortedExpectedFiles.filter((expectedFile) => !actualSet.has(expectedFile));
  let unexpectedFiles = actualFiles.filter((actualFile) => !isAllowedPackedFile(actualFile));

  return {
    expectedFiles: sortedExpectedFiles,
    missingFiles,
    unexpectedFiles,
  };
}

function normalizePackedPath(filePath: string): string {
  return filePath
    .split(path.sep)
    .join('/')
    .replace(/^\.\/+/, '')
    .replace(/^package\//, '');
}

function isAllowedPackedFile(filePath: string): boolean {
  let [topLevelSegment] = filePath.split('/');

  if (typeof topLevelSegment !== 'string') {
    return false;
  }

  return ALLOWED_TOP_LEVEL_DIRECTORIES.has(topLevelSegment);
}
