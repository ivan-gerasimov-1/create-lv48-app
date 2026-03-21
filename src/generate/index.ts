import path from 'node:path';
import { mkdir, readdir } from 'node:fs/promises';

import type {
  DirectoryPreflightResult,
  GenerationContext,
  GenerationRecord,
  GenerationRunner,
} from './types.js';
import {
  listRelativeDirectories,
  listRelativeFiles,
  pathExists,
  readUtf8File,
  removePaths,
  writeUtf8File,
} from '../utils/fs.js';
import type { TransformPipeline } from '../transforms/index.js';

export function createGenerationRunner(
  transformPipeline: TransformPipeline,
): GenerationRunner {
  return {
    status: 'ready',
    async prepare(context) {
      return ensureTargetDirectoryIsSafe(context);
    },
    async scaffold(context) {
      return scaffoldTemplate(context, transformPipeline);
    },
  };
}

async function ensureTargetDirectoryIsSafe(
  context: GenerationContext,
): Promise<DirectoryPreflightResult> {
  const targetExists = await pathExists(context.targetRoot);

  if (!targetExists) {
    return {
      targetRoot: context.targetRoot,
      isEmpty: true,
    };
  }

  const entries = await readdir(context.targetRoot);

  if (entries.length > 0) {
    throw new Error(
      `Target directory ${context.answers.targetDirectory} already contains files that would conflict with the scaffold.`,
    );
  }

  return {
    targetRoot: context.targetRoot,
    isEmpty: true,
  };
}

async function scaffoldTemplate(
  context: GenerationContext,
  transformPipeline: TransformPipeline,
): Promise<GenerationRecord> {
  const templateRoot = path.resolve(
    context.templateBaseDirectory,
    context.preset.templateDirectory,
  );

  if (!(await pathExists(templateRoot))) {
    throw new Error(`Template directory not found: ${templateRoot}`);
  }

  const templateDirectories = await listRelativeDirectories(templateRoot);
  const relativeDirectories = [
    ...templateDirectories.filter(isPublicTemplatePath),
    ...(context.preset.reservedDirectories ?? []),
  ].sort();
  const relativeFiles = (await listRelativeFiles(templateRoot)).filter(
    isPublicTemplatePath,
  );
  const targetRootExisted = await pathExists(context.targetRoot);
  const createdDirectories = new Set<string>();
  const createdFiles: string[] = [];

  await mkdir(context.targetRoot, { recursive: true });

  if (!targetRootExisted) {
    createdDirectories.add(context.targetRoot);
  }

  try {
    for (const relativeDirectory of relativeDirectories) {
      const destinationRelativePath = transformPipeline.mapDestinationPath(relativeDirectory);
      const destinationPath = path.join(context.targetRoot, destinationRelativePath);
      const wasCreated = createdDirectories.has(destinationPath);
      const isPreexistingTargetRoot = destinationPath === context.targetRoot && targetRootExisted;

      if (wasCreated || isPreexistingTargetRoot) {
        continue;
      }

      await mkdir(destinationPath, { recursive: true });
      createdDirectories.add(destinationPath);
    }

    for (const relativeFile of relativeFiles) {
      const sourcePath = path.join(templateRoot, relativeFile);
      const destinationRelativePath = transformPipeline.mapDestinationPath(relativeFile);
      const destinationPath = path.join(context.targetRoot, destinationRelativePath);
      const destinationDirectory = path.dirname(destinationPath);
      const destinationDirectoryWasCreated = createdDirectories.has(destinationDirectory);
      const isPreexistingTargetRoot =
        destinationDirectory === context.targetRoot && targetRootExisted;

      if (!destinationDirectoryWasCreated && !isPreexistingTargetRoot) {
        await mkdir(destinationDirectory, { recursive: true });
        createdDirectories.add(destinationDirectory);
      }

      const fileContents = await readUtf8File(sourcePath);
      const transformedContents = transformPipeline.transformTextFile(
        destinationRelativePath,
        fileContents,
        context,
      );

      await writeUtf8File(destinationPath, transformedContents);
      createdFiles.push(destinationPath);
    }
  } catch (error) {
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
  return relativePath !== '_meta' && !relativePath.startsWith('_meta/');
}

export type {
  DirectoryPreflightResult,
  GenerationContext,
  GenerationRecord,
  GenerationRunner,
  PlaceholderValues,
} from './types.js';
