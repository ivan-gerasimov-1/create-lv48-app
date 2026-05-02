export type TPackageManager = "npm";

export type TWorkspaceLayout = "single" | "multi";

export type TPromptAnswers = {
  projectName: string;
  packageName: string;
  displayName: string;
  targetDirectory: string;
  packageManager: TPackageManager;
  presetId: "base";
  installDependencies: boolean;
  initializeGit: boolean;
  workspaceLayout: TWorkspaceLayout;
  appProjectName?: string;
};

export type TPromptIO = {
  askText(message: string, defaultValue: string): Promise<string>;
  askConfirm(message: string, defaultValue: boolean): Promise<boolean>;
  askSelect(
    message: string,
    options: { value: string; label: string }[],
    defaultValue: string,
  ): Promise<string>;
  close(): Promise<void>;
};

export interface IPromptController {
  collectAnswers(defaultProjectName?: string): Promise<TPromptAnswers>;
}
