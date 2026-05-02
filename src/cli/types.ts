import type { TGenerationRecord } from "#/generate/types";

export type TPostSetupActionName = "installDependencies" | "initializeGit";

export type TPostSetupActionStatus = {
  name: TPostSetupActionName;
  selected: boolean;
  ok: boolean;
  detail: string;
};

export type TPostSetupActionStart = {
  name: TPostSetupActionName;
  detail: string;
  message: string;
};

export type TInitializationSummary = {
  projectName: string;
  targetDirectory: string;
  scaffold: {
    ok: boolean;
    filesCreated: number;
  };
  postSetup: TPostSetupActionStatus[];
  nextSteps: string[];
};

export type TCommandExecutor = (
  command: string,
  args: string[],
  cwd: string,
) => Promise<void>;

export type TPostSetupExecutor = {
  run(options: {
    targetRoot: string;
    installDependencies: boolean;
    initializeGit: boolean;
    onActionStart?(action: TPostSetupActionStart): void;
  }): Promise<TPostSetupActionStatus[]>;
};

export type TBuildSummaryOptions = {
  projectName: string;
  targetDirectory: string;
  record: TGenerationRecord;
  postSetup: TPostSetupActionStatus[];
};
