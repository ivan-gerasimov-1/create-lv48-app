export type TPackageManager = 'npm';

export type TPromptAnswers = {
  projectName: string;
  packageName: string;
  displayName: string;
  targetDirectory: string;
  packageManager: TPackageManager;
  presetId: 'base';
  installDependencies: boolean;
  initializeGit: boolean;
};

export type TPromptIO = {
  askText(message: string, defaultValue: string): Promise<string>;
  askConfirm(message: string, defaultValue: boolean): Promise<boolean>;
  close(): Promise<void>;
};

export type TPromptController = {
  collectAnswers(defaultProjectName?: string): Promise<TPromptAnswers>;
};
