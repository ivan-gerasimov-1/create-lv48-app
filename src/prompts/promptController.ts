import { validateName, validateTargetDirectory } from "#/utils/validation";

import type {
  IPromptController,
  TPromptAnswers,
  TPromptIO,
  TWorkspaceLayout,
} from "./types";

export class PromptController implements IPromptController {
  public constructor(private readonly promptIo: TPromptIO) {}

  public async collectAnswers(
    defaultProjectName = "lv48-app",
  ): Promise<TPromptAnswers> {
    try {
      let projectName = await this.askValidText(
        "Project name",
        defaultProjectName,
        validateName,
      );
      let targetDirectory = await this.askValidText(
        "Target directory",
        projectName,
        validateTargetDirectory,
      );
      let workspaceLayout = await this.askWorkspaceLayout();
      let appProjectName: string | undefined;

      if (workspaceLayout === "multi") {
        appProjectName = await this.askValidText(
          "First app project name",
          "project-1",
          validateName,
        );
      }

      let installDependencies = await this.promptIo.askConfirm(
        "Install npm dependencies after generation?",
        true,
      );
      let initializeGit = await this.promptIo.askConfirm(
        "Initialize a git repository?",
        true,
      );

      return {
        projectName,
        packageName: projectName,
        displayName: createDisplayName(projectName),
        targetDirectory,
        packageManager: "npm",
        presetId: "base",
        installDependencies,
        initializeGit,
        workspaceLayout,
        appProjectName,
      };
    } finally {
      await this.promptIo.close();
    }
  }

  private async askWorkspaceLayout(): Promise<TWorkspaceLayout> {
    let answer = await this.promptIo.askSelect(
      "Workspace layout",
      [
        { value: "single", label: "Single project" },
        { value: "multi", label: "Multi-project workspace" },
      ],
      "single",
    );

    if (answer === "multi") {
      return "multi";
    }

    return "single";
  }

  private async askValidText(
    message: string,
    defaultValue: string,
    validate: (
      input: string,
    ) => { ok: true; value: string } | { ok: false; reason: string },
  ): Promise<string> {
    for (;;) {
      let answer = await this.promptIo.askText(message, defaultValue);
      let result = validate(answer);

      if (result.ok) {
        return result.value;
      }

      console.error(result.reason);
    }
  }
}

function createDisplayName(projectName: string): string {
  return projectName
    .split("-")
    .filter((segment) => segment.length > 0)
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join(" ");
}

export type { TPromptAnswers, TPromptIO };
