import type { PromptAnswers } from '../prompts/types.js';
import type { PresetMetadata } from '../presets/types.js';

export type PlaceholderValues = Record<string, string>;

export type GenerationContext = {
  cwd: string;
  targetRoot: string;
  answers: PromptAnswers;
  preset: PresetMetadata;
  placeholders: PlaceholderValues;
};

export type GenerationRecord = {
  createdDirectories: string[];
  createdFiles: string[];
};

export type DirectoryPreflightResult = {
  targetRoot: string;
  isEmpty: boolean;
};

export type GenerationRunner = {
  status: 'ready';
  prepare(context: GenerationContext): Promise<DirectoryPreflightResult>;
  scaffold(context: GenerationContext): Promise<GenerationRecord>;
};
