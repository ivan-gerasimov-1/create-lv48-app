import { createGenerationRunner } from './generate/index.js';
import { createPresetRegistry } from './presets/index.js';
import { createPromptController } from './prompts/index.js';
import { createTransformPipeline } from './transforms/index.js';
import { createLogger } from './utils/logging.js';

export async function runCli() {
  const logger = createLogger();
  const prompts = createPromptController();
  const presets = createPresetRegistry();
  const transforms = createTransformPipeline();
  const generation = createGenerationRunner(transforms);
  const answers = await prompts.collectAnswers();
  const preset = presets.getDefaultPreset();

  logger.info(`create-lv48-app will scaffold ${answers.projectName} with ${preset.id}.`);
  logger.debug({
    answers,
    preset,
    transforms,
    generation,
  });
}
