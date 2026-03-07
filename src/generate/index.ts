export type GenerationRunner = {
  status: 'idle';
};

export function createGenerationRunner(): GenerationRunner {
  return {
    status: 'idle',
  };
}
