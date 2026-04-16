import path from "node:path";

import {
  buildInitializationSummary,
  formatInitializationSummary,
} from "./cli/summary.js";
import { createPlaceholderValues } from "./cli/placeholders.js";
import { createPostSetupExecutor } from "./cli/postSetup.js";
import type { TCliDependencies } from "./cli/types.js";
import { createGenerationRunner } from "./generate/generationRunner.js";
import { PACKAGE_ROOT } from "./packageRoot.js";
import { createPresetRegistry } from "./presets/presetRegistry.js";
import { createPromptController } from "./prompts/promptController.js";
import { createTransformPipeline } from "./transforms/transformPipeline.js";
import { readUtf8File } from "./utils/fs.js";
import { createLogger } from "./utils/logging.js";
import { baseTemplate } from "../templates/base/template.js";

export async function runCli(dependencies: TCliDependencies = {}) {
  if (process.argv.includes("--version")) {
    let raw = JSON.parse(
      await readUtf8File(path.join(PACKAGE_ROOT, "package.json")),
    );
    let version = typeof raw?.version === "string" ? raw.version : "unknown";
    console.log(version);
    return;
  }

  let logger = dependencies.logger ?? createLogger();
  let prompts = dependencies.promptController ?? createPromptController();
  let presets = createPresetRegistry();
  let transforms = createTransformPipeline();
  let generation = createGenerationRunner(transforms);
  let postSetupExecutor = createPostSetupExecutor(dependencies.commandExecutor);
  let cwd = dependencies.cwd ?? process.cwd();
  let answers = await prompts.collectAnswers();
  let preset = presets.getDefaultPreset();
  let targetRoot = path.resolve(cwd, answers.targetDirectory);
  let placeholders = createPlaceholderValues(answers);

  logger.info(
    `create-lv48-app will scaffold ${answers.projectName} with ${preset.id}.`,
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
  let summary = buildInitializationSummary({
    projectName: answers.projectName,
    targetDirectory: answers.targetDirectory,
    record,
    postSetup,
  });

  logger.info(formatInitializationSummary(summary));
  logger.debug({
    answers,
    preset,
    placeholders,
    transforms,
    generation,
    summary,
  });
}
