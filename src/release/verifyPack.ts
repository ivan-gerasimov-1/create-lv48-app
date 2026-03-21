import path from 'node:path';

import { listRelativeFiles } from '../utils/fs.js';
import type { PackedFile, ReleaseVerificationResult } from './types.js';

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
  const distFiles = await listRelativeFiles(path.join(repositoryRoot, 'dist'));
  const templateFiles = await listRelativeFiles(path.join(repositoryRoot, 'templates'));

  return [
    ...STATIC_EXPECTED_PACKED_FILES,
    ...distFiles.map((f) => `dist/${f.split(path.sep).join('/')}`),
    ...templateFiles.map((f) => `templates/${f.split(path.sep).join('/')}`),
  ].sort();
}

export function verifyPackedFiles(
  files: PackedFile[],
  expectedFiles: string[],
): ReleaseVerificationResult {
  const actualFiles = files
    .map((file) => normalizePackedPath(file.path))
    .filter((filePath) => filePath.length > 0)
    .sort();

  const actualSet = new Set(actualFiles);
  const sortedExpectedFiles = [...expectedFiles].sort();
  const missingFiles = sortedExpectedFiles.filter((expectedFile) => !actualSet.has(expectedFile));
  const unexpectedFiles = actualFiles.filter((actualFile) => !isAllowedPackedFile(actualFile));

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
  const [topLevelSegment] = filePath.split('/');

  if (typeof topLevelSegment !== 'string') {
    return false;
  }

  return ALLOWED_TOP_LEVEL_DIRECTORIES.has(topLevelSegment);
}
