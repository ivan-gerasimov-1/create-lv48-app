import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

import type { TTransformPipeline } from "#/transforms/types";
import {
  listRelativeDirectories,
  listRelativeFiles,
  pathExists,
  readUtf8File,
  removePaths,
  writeUtf8File,
} from "#/utils/fs";

import type {
  TGenerationContext,
  TGenerationRecord,
  TGenerationRunner,
} from "./types";

export function createGenerationRunner(
  transformPipeline: TTransformPipeline,
): TGenerationRunner {
  return {
    async prepare(context) {
      await ensureTargetDirectoryIsSafe(context);
    },
    async scaffold(context) {
      return scaffoldTemplate(context, transformPipeline);
    },
  };
}

async function ensureTargetDirectoryIsSafe(
  context: TGenerationContext,
): Promise<void> {
  let targetExists = await pathExists(context.targetRoot);

  if (!targetExists) {
    return;
  }

  let entries = await readdir(context.targetRoot);

  if (entries.length > 0) {
    throw new Error(
      `Target directory ${context.answers.targetDirectory} already contains files that would conflict with the scaffold.`,
    );
  }
}

async function scaffoldTemplate(
  context: TGenerationContext,
  transformPipeline: TTransformPipeline,
): Promise<TGenerationRecord> {
  let templateRoot = context.filesRoot;

  if (!(await pathExists(templateRoot))) {
    throw new Error(`Template directory not found: ${templateRoot}`);
  }

  let templateDirectories = await listRelativeDirectories(templateRoot);
  let relativeDirectories = [
    ...templateDirectories.filter(isPublicTemplatePath),
    ...(context.preset.reservedDirectories ?? []),
  ].sort();
  let relativeFiles = (await listRelativeFiles(templateRoot)).filter(
    isPublicTemplatePath,
  );
  let targetRootExisted = await pathExists(context.targetRoot);
  let createdDirectories = new Set<string>();
  let createdFiles: string[] = [];

  await mkdir(context.targetRoot, { recursive: true });

  if (!targetRootExisted) {
    createdDirectories.add(context.targetRoot);
  }

  try {
    for (let relativeDirectory of relativeDirectories) {
      let destinationRelativePath = transformPipeline.mapDestinationPath(
        relativeDirectory,
        context,
      );
      let destinationPath = path.join(
        context.targetRoot,
        destinationRelativePath,
      );
      let wasCreated = createdDirectories.has(destinationPath);
      let isPreexistingTargetRoot =
        destinationPath === context.targetRoot && targetRootExisted;

      if (wasCreated || isPreexistingTargetRoot) {
        continue;
      }

      await mkdir(destinationPath, { recursive: true });
      createdDirectories.add(destinationPath);
    }

    for (let relativeFile of relativeFiles) {
      let sourcePath = path.join(templateRoot, relativeFile);
      let destinationRelativePath = transformPipeline.mapDestinationPath(
        relativeFile,
        context,
      );
      let destinationPath = path.join(
        context.targetRoot,
        destinationRelativePath,
      );
      let destinationDirectory = path.dirname(destinationPath);
      let destinationDirectoryWasCreated =
        createdDirectories.has(destinationDirectory);
      let isPreexistingTargetRoot =
        destinationDirectory === context.targetRoot && targetRootExisted;

      if (!destinationDirectoryWasCreated && !isPreexistingTargetRoot) {
        await mkdir(destinationDirectory, { recursive: true });
        createdDirectories.add(destinationDirectory);
      }

      let fileContents = await readUtf8File(sourcePath);
      let transformedContents = transformPipeline.transformTextFile(
        destinationRelativePath,
        fileContents,
        context,
      );

      await writeUtf8File(destinationPath, transformedContents);
      createdFiles.push(destinationPath);
    }
  } catch (error) {
    // Rollback: removePaths reverses the array internally, so files are removed
    // before directories. This relies on rm using { recursive: true, force: true }.
    try {
      await removePaths([...createdFiles, ...createdDirectories]);
    } catch {
      // cleanup failure must not suppress the original scaffolding error
    }
    throw error;
  }

  return {
    createdDirectories: [...createdDirectories],
    createdFiles,
  };
}

function isPublicTemplatePath(relativePath: string): boolean {
  return relativePath !== "_meta" && !relativePath.startsWith("_meta/");
}

export type {
  TGenerationContext,
  TGenerationRecord,
  TGenerationRunner,
  TPlaceholderValues,
} from "./types";
