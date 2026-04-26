import path from "node:path";

import { Either } from "#/utils/either/either";

import type { TValidationResult } from "./types";

const PROJECT_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateProjectName(input: string): TValidationResult<string> {
  let value = input.trim();

  if (value.length === 0) {
    return Either.failure("Project name is required.");
  }

  if (!PROJECT_NAME_PATTERN.test(value)) {
    return Either.failure(
      "Project name must use lowercase letters, numbers, and single hyphens only.",
    );
  }

  return Either.success(value);
}

export function validatePackageName(input: string): TValidationResult<string> {
  return validateProjectName(input);
}

export function validateTargetDirectory(
  input: string,
): TValidationResult<string> {
  let trimmedValue = input.trim();

  if (trimmedValue.length === 0) {
    return Either.failure("Target directory is required.");
  }

  let normalizedValue = path.normalize(trimmedValue);

  if (path.isAbsolute(normalizedValue)) {
    return Either.failure(
      "Target directory must be relative to the current working directory.",
    );
  }

  if (normalizedValue === ".." || normalizedValue.startsWith(`..${path.sep}`)) {
    return Either.failure(
      "Target directory must stay within the current working directory.",
    );
  }

  return Either.success(normalizedValue);
}
