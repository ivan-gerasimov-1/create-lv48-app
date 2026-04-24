import path from "node:path";

import {
  buildInitializationSummary,
  formatInitializationSummary,
} from "./cli/summary";
import { createPlaceholderValues } from "./cli/placeholders";
import { createPostSetupExecutor, executeCommand } from "./cli/postSetup";
import type { TCliDependencies } from "./cli/types";
import { createGenerationRunner } from "./generate/generationRunner";
import { PACKAGE_ROOT } from "./packageRoot";
import { createPresetRegistry } from "./presets/presetRegistry";
import { createClackPromptIo } from "./prompts/clackPromptIo";
import { createPromptController } from "./prompts/promptController";
import { createTransformPipeline } from "./transforms/transformPipeline";
import { readUtf8File } from "./utils/fs";
import { createLogger } from "./utils/logging";
import { baseTemplate } from "../templates/base/template";

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
