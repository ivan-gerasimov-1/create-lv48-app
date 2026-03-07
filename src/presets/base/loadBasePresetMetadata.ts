import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { PresetMetadata } from '../types.js';

const CURRENT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const METADATA_PATH = path.resolve(
  CURRENT_DIRECTORY,
  '../../../templates/base/_meta/template.json',
);

export function loadBasePresetMetadata(): PresetMetadata {
  const fileContents = readFileSync(METADATA_PATH, 'utf8');
  const parsedValue = JSON.parse(fileContents);

  if (!isPresetMetadata(parsedValue)) {
    throw new Error('Base preset metadata is invalid.');
  }

  return parsedValue;
}

function isPresetMetadata(value: unknown): value is PresetMetadata {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if (!('id' in value) || value.id !== 'base') {
    return false;
  }

  if (!('displayName' in value) || typeof value.displayName !== 'string') {
    return false;
  }

  if (!('description' in value) || typeof value.description !== 'string') {
    return false;
  }

  if (!('templateDirectory' in value) || typeof value.templateDirectory !== 'string') {
    return false;
  }

  if (!('packageManagers' in value) || !Array.isArray(value.packageManagers)) {
    return false;
  }

  if (!('placeholderKeys' in value) || !Array.isArray(value.placeholderKeys)) {
    return false;
  }

  if (!('postGeneration' in value) || typeof value.postGeneration !== 'object') {
    return false;
  }

  const postGeneration = value.postGeneration;

  if (
    !postGeneration ||
    !('installDependencies' in postGeneration) ||
    !('initializeGit' in postGeneration)
  ) {
    return false;
  }

  return (
    typeof postGeneration.installDependencies === 'boolean' &&
    typeof postGeneration.initializeGit === 'boolean'
  );
}
