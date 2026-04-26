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
  IGenerationRunner,
  TGenerationContext,
  TGenerationRecord,
} from "./types";

export class GenerationRunner implements IGenerationRunner {
  public constructor(private transformPipeline: TTransformPipeline) {}

  public async prepare(context: TGenerationContext): Promise<void> {
    await this.ensureTargetDirectoryIsSafe(context);
  }

  public async scaffold(
    context: TGenerationContext,
  ): Promise<TGenerationRecord> {
    return this.scaffoldTemplate(context);
  }

  private async ensureTargetDirectoryIsSafe(
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

  private async scaffoldTemplate(
    context: TGenerationContext,
  ): Promise<TGenerationRecord> {
    let templateRoot = context.filesRoot;

    if (!(await pathExists(templateRoot))) {
      throw new Error(`Template directory not found: ${templateRoot}`);
    }

    let templateDirectories = await listRelativeDirectories(templateRoot);
    let relativeDirectories = [
      ...templateDirectories.filter((relativePath) =>
        this.isPublicTemplatePath(relativePath),
      ),
      ...(context.preset.reservedDirectories ?? []),
    ].sort();
    let relativeFiles = (await listRelativeFiles(templateRoot)).filter(
      (relativePath) => this.isPublicTemplatePath(relativePath),
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
        let destinationRelativePath =
          this.transformPipeline.mapDestinationPath(relativeDirectory, context);
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
        let destinationRelativePath =
          this.transformPipeline.mapDestinationPath(relativeFile, context);
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
        let transformedContents = this.transformPipeline.transformTextFile(
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

  private isPublicTemplatePath(relativePath: string): boolean {
    return relativePath !== "_meta" && !relativePath.startsWith("_meta/");
  }
}
