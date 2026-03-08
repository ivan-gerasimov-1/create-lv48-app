import type { GenerationRecord } from '../generate/types.js';

import type { PromptController } from '../prompts/types.js';

export type PostSetupActionName = 'installDependencies' | 'initializeGit';

export type PostSetupActionStatus = {
  name: PostSetupActionName;
  selected: boolean;
  ok: boolean;
  detail: string;
};

export type PostSetupActionStart = {
  name: PostSetupActionName;
  detail: string;
  message: string;
};

export type InitializationSummary = {
  projectName: string;
  targetDirectory: string;
  scaffold: {
    ok: boolean;
    filesCreated: number;
  };
  postSetup: PostSetupActionStatus[];
  nextSteps: string[];
};

export type CommandExecutor = (
  command: string,
  args: string[],
  cwd: string,
) => Promise<void>;

export type PostSetupExecutor = {
  run(options: {
    targetRoot: string;
    installDependencies: boolean;
    initializeGit: boolean;
    onActionStart?(action: PostSetupActionStart): void;
  }): Promise<PostSetupActionStatus[]>;
};

export type CliDependencies = {
  commandExecutor?: CommandExecutor;
  cwd?: string;
  promptController?: PromptController;
  logger?: {
    info(message: string): void;
    debug(payload: unknown): void;
    error(message: string): void;
  };
};

export type BuildSummaryOptions = {
  projectName: string;
  targetDirectory: string;
  record: GenerationRecord;
  postSetup: PostSetupActionStatus[];
};
