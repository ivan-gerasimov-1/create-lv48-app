export type PackageManager = 'npm';

export type PromptAnswers = {
  projectName: string;
  packageName: string;
  displayName: string;
  targetDirectory: string;
  packageManager: PackageManager;
  presetId: 'base';
  installDependencies: boolean;
  initializeGit: boolean;
};

export type PromptIO = {
  askText(message: string, defaultValue: string): Promise<string>;
  askConfirm(message: string, defaultValue: boolean): Promise<boolean>;
  close(): Promise<void>;
};

export type PromptController = {
  phase: 'phase-1';
  collectAnswers(defaultProjectName?: string): Promise<PromptAnswers>;
};
