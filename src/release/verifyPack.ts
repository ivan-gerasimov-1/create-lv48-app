import path from 'node:path';

import type { PackedFile, ReleaseVerificationResult } from './types.js';

const EXPECTED_PACKED_FILES = [
  'LICENSE',
  'README.md',
  'bin/create-lv48-app.js',
  'dist/cli.d.ts',
  'dist/cli.js',
  'dist/cli.js.map',
  'dist/generate/index.js',
  'dist/presets/index.js',
  'dist/prompts/index.js',
  'dist/transforms/index.js',
  'dist/utils/fs.js',
  'package.json',
  'templates/base/_meta/template.json',
  'templates/base/README.md',
  'templates/base/apps/api/package.json',
  'templates/base/apps/site/package.json',
  'templates/base/apps/web/package.json',
  'templates/base/package.json',
].sort();

const ALLOWED_TOP_LEVEL_DIRECTORIES = new Set([
  'bin',
  'dist',
  'package.json',
  'templates',
  'LICENSE',
  'README.md',
]);

export function getExpectedPackedFiles(): string[] {
  return [...EXPECTED_PACKED_FILES];
}

export function verifyPackedFiles(files: PackedFile[]): ReleaseVerificationResult {
  const actualFiles = files
    .map((file) => normalizePackedPath(file.path))
    .filter((filePath) => filePath.length > 0)
    .sort();

  const actualSet = new Set(actualFiles);
  const expectedFiles = getExpectedPackedFiles();
  const missingFiles = expectedFiles.filter((expectedFile) => !actualSet.has(expectedFile));
  const unexpectedFiles = actualFiles.filter((actualFile) => !isAllowedPackedFile(actualFile));

  return {
    expectedFiles,
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
