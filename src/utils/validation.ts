import path from "node:path";

import { z } from "zod";

import { Either } from "#/utils/either/either";

const GENERIC_VALIDATION_ERROR_MESSAGE = "Validation failed.";

const projectNameSchema = z
  .string()
  .trim()
  .min(1, "Project name is required.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Project name must use lowercase letters, numbers, and single hyphens only.",
  );

const targetDirectorySchema = z
  .string()
  .trim()
  .min(1, "Target directory is required.")
  .transform((value) => path.normalize(value))
  .refine(
    (value) => !path.isAbsolute(value),
    "Target directory must be relative to the current working directory.",
  )
  .refine(
    (value) => value !== ".." && !value.startsWith(`..${path.sep}`),
    "Target directory must stay within the current working directory.",
  );

export function validateProjectName(input: string) {
  let result = projectNameSchema.safeParse(input);

  if (result.success) {
    return Either.success(result.data);
  }

  let [issue] = result.error.issues;

  return Either.failure(
    issue ? issue.message : GENERIC_VALIDATION_ERROR_MESSAGE,
  );
}

export function validatePackageName(input: string) {
  return validateProjectName(input);
}

export function validateTargetDirectory(input: string) {
  let result = targetDirectorySchema.safeParse(input);

  if (result.success) {
    return Either.success(result.data);
  }

  let [issue] = result.error.issues;

  return Either.failure(
    issue ? issue.message : GENERIC_VALIDATION_ERROR_MESSAGE,
  );
}
