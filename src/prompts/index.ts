export type PromptController = {
  phase: 'phase-1';
};

export function createPromptController(): PromptController {
  return {
    phase: 'phase-1',
  };
}
