import type { TPromptAnswers } from "../prompts/types";
import type { TPresetMetadata } from "../presets/types";

export type TPlaceholderValues = Record<string, string>;

export type TGenerationContext = {
  cwd: string;
  filesRoot: string;
  targetRoot: string;
  answers: TPromptAnswers;
  preset: TPresetMetadata;
  placeholders: TPlaceholderValues;
};

export type TGenerationRecord = {
  createdDirectories: string[];
  createdFiles: string[];
};

export type TGenerationRunner = {
  prepare(context: TGenerationContext): Promise<void>;
  scaffold(context: TGenerationContext): Promise<TGenerationRecord>;
};
