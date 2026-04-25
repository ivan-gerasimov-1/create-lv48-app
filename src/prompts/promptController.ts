import {
  validateProjectName,
  validateTargetDirectory,
} from "#/utils/validation";

import type {
  TPromptAnswers,
  TPromptController,
  TPromptIO,
  TWorkspaceLayout,
} from "./types";

export function createPromptController(promptIo: TPromptIO): TPromptController {
  return {
    async collectAnswers(defaultProjectName = "lv48-app") {
      try {
        let projectName = await askValidText(
          promptIo,
          "Project name",
          defaultProjectName,
          validateProjectName,
        );
        let targetDirectory = await askValidText(
          promptIo,
          "Target directory",
          projectName,
          validateTargetDirectory,
        );
        let workspaceLayout = await askWorkspaceLayout(promptIo);
        let appProjectName: string | undefined;

        if (workspaceLayout === "multi") {
          appProjectName = await askValidText(
            promptIo,
            "First app project name",
            "project-1",
            validateProjectName,
          );
        }

        let installDependencies = await promptIo.askConfirm(
          "Install npm dependencies after generation?",
          true,
        );
        let initializeGit = await promptIo.askConfirm(
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
        await promptIo.close();
      }
    },
  };
}

async function askWorkspaceLayout(
  promptIo: TPromptIO,
): Promise<TWorkspaceLayout> {
  let answer = await promptIo.askSelect(
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

async function askValidText(
  promptIo: TPromptIO,
  message: string,
  defaultValue: string,
  validate: (
    input: string,
  ) => { ok: true; value: string } | { ok: false; reason: string },
) {
  for (;;) {
    let answer = await promptIo.askText(message, defaultValue);
    let result = validate(answer);

    if (result.ok) {
      return result.value;
    }

    console.error(result.reason);
  }
}

function createDisplayName(projectName: string): string {
  return projectName
    .split("-")
    .filter((segment) => segment.length > 0)
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join(" ");
}

export type { TPromptAnswers, TPromptController, TPromptIO };
