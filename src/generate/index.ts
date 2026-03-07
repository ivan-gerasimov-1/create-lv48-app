import path from 'node:path';
import { cp, mkdir, readdir } from 'node:fs/promises';

import type {
  DirectoryPreflightResult,
  GenerationContext,
  GenerationRecord,
  GenerationRunner,
} from './types.js';
import { listRelativeFiles, pathExists, readUtf8File, writeUtf8File } from '../utils/fs.js';
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
  const relativeFiles = (await listRelativeFiles(templateRoot)).filter(
    (relativeFile) => !relativeFile.startsWith('_meta/'),
  );
  const createdDirectories: string[] = [];
  const createdFiles: string[] = [];

  await mkdir(context.targetRoot, { recursive: true });
  createdDirectories.push(context.targetRoot);

  for (const relativeFile of relativeFiles) {
    const sourcePath = path.join(templateRoot, relativeFile);
    const destinationRelativePath = transformPipeline.mapDestinationPath(relativeFile);
    const destinationPath = path.join(context.targetRoot, destinationRelativePath);
    const destinationDirectory = path.dirname(destinationPath);

    if (!createdDirectories.includes(destinationDirectory)) {
      await mkdir(destinationDirectory, { recursive: true });
      createdDirectories.push(destinationDirectory);
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

  return {
    createdDirectories,
    createdFiles,
  };
}

export type {
  DirectoryPreflightResult,
  GenerationContext,
  GenerationRecord,
  GenerationRunner,
  PlaceholderValues,
} from './types.js';
