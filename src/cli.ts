import path from "node:path";

import { baseTemplate } from "#/templates/base/template";

import { GenerationRunner } from "#/generate/generationRunner";
import { PresetRegistry } from "#/presets/presetRegistry/presetRegistry";
import { createClackPromptIo } from "#/prompts/clackPromptIo";
import { createPromptController } from "#/prompts/promptController";
import { createTransformPipeline } from "#/transforms/transformPipeline";
import { Logger } from "#/utils/logger/logger";

import { createPlaceholderValues } from "#/cli/placeholders";
import { createPostSetupExecutor, executeCommand } from "#/cli/postSetup";
import { InitializationSummary } from "#/cli/summary";
import { getPackageVersion } from "#/packageRoot";

export async function runCli() {
  let logger = new Logger();

  let args = process.argv.slice(2);

  if (args.includes("--version") || args.includes("-v")) {
    let version = await getPackageVersion();

    logger.info(version);

    return;
  }

  let prompts = createPromptController(createClackPromptIo());
  let presets = new PresetRegistry();
  let transforms = createTransformPipeline();
  let generation = new GenerationRunner(transforms);
  let postSetupExecutor = createPostSetupExecutor(executeCommand);
  let initializationSummary = new InitializationSummary();
  let cwd = process.cwd();

  let answers = await prompts.collectAnswers();

  let preset = presets.get(answers.presetId);
  let targetRoot = path.resolve(cwd, answers.targetDirectory);
  let placeholders = createPlaceholderValues(answers);

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
