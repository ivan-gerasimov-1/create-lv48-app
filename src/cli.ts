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
  const generation = createGenerationRunner();

  logger.info('create-lv48-app bootstrap is ready.');
  logger.debug({
    prompts,
    presets,
    transforms,
    generation,
  });
}
