import path from "node:path";

import { z } from "zod";

import { Either } from "#/utils/either/either";

const GENERIC_VALIDATION_ERROR_MESSAGE = "Validation failed.";

const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Name must use lowercase letters, numbers, and single hyphens only.",
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

export function validateName(input: string) {
  let result = nameSchema.safeParse(input);

  if (result.success) {
    return Either.success(result.data);
  }

  let [issue] = result.error.issues;

  return Either.failure(
    issue ? issue.message : GENERIC_VALIDATION_ERROR_MESSAGE,
  );
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
