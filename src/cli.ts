import path from "node:path";

import { baseTemplate } from "#/templates/base/template";

import { createGenerationRunner } from "#/generate/generationRunner";
import { createPresetRegistry } from "#/presets/presetRegistry";
import { createClackPromptIo } from "#/prompts/clackPromptIo";
import { createPromptController } from "#/prompts/promptController";
import { createTransformPipeline } from "#/transforms/transformPipeline";
import { Logger } from "#/utils/logger/logger";

import { createPlaceholderValues } from "#/cli/placeholders";
import { createPostSetupExecutor, executeCommand } from "#/cli/postSetup";
import { InitializationSummary } from "#/cli/summary";
import type { TCliDependencies } from "#/cli/types";

export async function runCli(dependencies: TCliDependencies = {}) {
  let logger = dependencies.logger ?? new Logger();
  let prompts =
    dependencies.promptController ??
    createPromptController(createClackPromptIo());
  let presets = createPresetRegistry();
  let transforms = createTransformPipeline();
  let generation = createGenerationRunner(transforms);
  let postSetupExecutor = createPostSetupExecutor(
    dependencies.commandExecutor ?? executeCommand,
  );
  let cwd = dependencies.cwd ?? process.cwd();
  let answers = await prompts.collectAnswers();
  let preset = presets.getDefaultPreset();
  let targetRoot = path.resolve(cwd, answers.targetDirectory);
  let placeholders = createPlaceholderValues(answers);

  let initializationSummary = new InitializationSummary();

  logger.info(
    `create-lv48-app will scaffold ${answers.projectName} with ${preset.name}.`,
  );

  await generation.prepare({
    cwd,
    filesRoot: baseTemplate.filesRoot,
    targetRoot,
    answers,
    preset,
    placeholders,
  });

  let record = await generation.scaffold({
    cwd,
    filesRoot: baseTemplate.filesRoot,
    targetRoot,
    answers,
    preset,
    placeholders,
  });
  let postSetup = await postSetupExecutor.run({
    targetRoot,
    installDependencies: answers.installDependencies,
    initializeGit: answers.initializeGit,
    onActionStart(action) {
      logger.info(action.message);
    },
  });

  let summary = initializationSummary.build({
    projectName: answers.projectName,
    targetDirectory: answers.targetDirectory,
    record,
    postSetup,
  });

  logger.info(initializationSummary.format(summary));

  logger.debug({
    answers,
    preset,
    placeholders,
    transforms,
    generation,
    summary,
  });
}
