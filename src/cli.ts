import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildInitializationSummary, formatInitializationSummary } from './cli/summary.js';
import { createPlaceholderValues } from './cli/placeholders.js';
import { createPostSetupExecutor } from './cli/postSetup.js';
import type { CliDependencies } from './cli/types.js';
import { createGenerationRunner } from './generate/index.js';
import { createPresetRegistry } from './presets/index.js';
import { createPromptController } from './prompts/index.js';
import { createTransformPipeline } from './transforms/index.js';
import { createLogger } from './utils/logging.js';

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function runCli(dependencies: CliDependencies = {}) {
  const logger = dependencies.logger ?? createLogger();
  const prompts = dependencies.promptController ?? createPromptController();
  const presets = createPresetRegistry();
  const transforms = createTransformPipeline();
  const generation = createGenerationRunner(transforms);
  const postSetupExecutor = createPostSetupExecutor(dependencies.commandExecutor);
  const cwd = dependencies.cwd ?? process.cwd();
  const answers = await prompts.collectAnswers();
  const preset = presets.getDefaultPreset();
  const targetRoot = path.resolve(cwd, answers.targetDirectory);
  const placeholders = createPlaceholderValues(answers);

  await generation.prepare({
    cwd,
    templateBaseDirectory: PACKAGE_ROOT,
    targetRoot,
    answers,
    preset,
    placeholders,
  });

  const record = await generation.scaffold({
    cwd,
    templateBaseDirectory: PACKAGE_ROOT,
    targetRoot,
    answers,
    preset,
    placeholders,
  });
  const postSetup = await postSetupExecutor.run({
    targetRoot,
    installDependencies: answers.installDependencies,
    initializeGit: answers.initializeGit,
  });
  const summary = buildInitializationSummary({
    projectName: answers.projectName,
    targetDirectory: answers.targetDirectory,
    record,
    postSetup,
  });

  logger.info(`create-lv48-app will scaffold ${answers.projectName} with ${preset.id}.`);
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
