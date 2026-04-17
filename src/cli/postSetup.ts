import { spawn } from "node:child_process";

import type {
  TCommandExecutor,
  TPostSetupActionName,
  TPostSetupActionStatus,
  TPostSetupActionStart,
  TPostSetupExecutor,
} from "./types.js";

const INITIALIZE_GIT_WITH_MAIN_ARGS = ["init", "--initial-branch=main"];
const INITIALIZE_GIT_FALLBACK_ARGS = ["init"];
const SET_GIT_HEAD_TO_MAIN_ARGS = ["symbolic-ref", "HEAD", "refs/heads/main"];
const POST_SETUP_ACTION_MESSAGES: Record<TPostSetupActionName, string> = {
  installDependencies:
    "Post-setup: installing npm dependencies. This can take a moment...",
  initializeGit: "Post-setup: initializing a git repository on branch main...",
};

interface IPostSetupAction {
  readonly name: TPostSetupActionName;
  readonly detail: string;
  readonly message: string;

  createSkippedStatus(): TPostSetupActionStatus;
  createCompletedStatus(): TPostSetupActionStatus;
  createFailedStatus(error: unknown): TPostSetupActionStatus;
  execute(commandExecutor: TCommandExecutor, targetRoot: string): Promise<void>;
}

class InstallDependenciesAction implements IPostSetupAction {
  readonly name: TPostSetupActionName = "installDependencies";
  readonly detail = "npm install";
  readonly message = POST_SETUP_ACTION_MESSAGES.installDependencies;

  public createSkippedStatus(): TPostSetupActionStatus {
    return {
      name: this.name,
      selected: false,
      ok: true,
      detail: `${this.detail} skipped`,
    };
  }

  public createCompletedStatus(): TPostSetupActionStatus {
    return {
      name: this.name,
      selected: true,
      ok: true,
      detail: `${this.detail} completed`,
    };
  }

  public createFailedStatus(error: unknown): TPostSetupActionStatus {
    let message =
      error instanceof Error ? error.message : "Unknown command failure";
    return {
      name: this.name,
      selected: true,
      ok: false,
      detail: `${this.detail} failed: ${message}`,
    };
  }

  public async execute(
    commandExecutor: TCommandExecutor,
    targetRoot: string,
  ): Promise<void> {
    return commandExecutor("npm", ["install"], targetRoot);
  }
}

class InitializeGitAction implements IPostSetupAction {
  readonly name: TPostSetupActionName = "initializeGit";
  readonly detail = "git init";
  readonly message = POST_SETUP_ACTION_MESSAGES.initializeGit;

  public createSkippedStatus(): TPostSetupActionStatus {
    return {
      name: this.name,
      selected: false,
      ok: true,
      detail: `${this.detail} skipped`,
    };
  }

  public createCompletedStatus(): TPostSetupActionStatus {
    return {
      name: this.name,
      selected: true,
      ok: true,
      detail: `${this.detail} completed`,
    };
  }

  public createFailedStatus(error: unknown): TPostSetupActionStatus {
    let message =
      error instanceof Error ? error.message : "Unknown command failure";
    return {
      name: this.name,
      selected: true,
      ok: false,
      detail: `${this.detail} failed: ${message}`,
    };
  }

  public async execute(
    commandExecutor: TCommandExecutor,
    targetRoot: string,
  ): Promise<void> {
    try {
      await commandExecutor("git", INITIALIZE_GIT_WITH_MAIN_ARGS, targetRoot);
    } catch (error) {
      if (!this.isUnsupportedInitialBranchError(error)) {
        throw error;
      }

      await commandExecutor("git", INITIALIZE_GIT_FALLBACK_ARGS, targetRoot);
      await commandExecutor("git", SET_GIT_HEAD_TO_MAIN_ARGS, targetRoot);
    }
  }

  private isUnsupportedInitialBranchError(error: unknown): boolean {
    if (!(error instanceof Error)) {
      return false;
    }

    let message = error.message.toLowerCase();

    // git < 2.28 uses various phrasings depending on version and platform
    return (
      message.includes("initial-branch") &&
      (message.includes("unknown option") ||
        message.includes("unknown switch") ||
        message.includes("unrecognized option") ||
        message.includes("invalid option"))
    );
  }
}

class PostSetupExecutor implements TPostSetupExecutor {
  private readonly commandExecutor: TCommandExecutor;
  private readonly actions: IPostSetupAction[];

  constructor(commandExecutor: TCommandExecutor) {
    this.commandExecutor = commandExecutor;
    this.actions = [new InstallDependenciesAction(), new InitializeGitAction()];
  }

  async run({
    targetRoot,
    installDependencies,
    initializeGit,
    onActionStart,
  }: {
    targetRoot: string;
    installDependencies: boolean;
    initializeGit: boolean;
    onActionStart?(action: TPostSetupActionStart): void;
  }): Promise<TPostSetupActionStatus[]> {
    let statuses: TPostSetupActionStatus[] = [];
    let selectedActions: { action: IPostSetupAction; selected: boolean }[] = [];

    if (this.actions[0]) {
      selectedActions.push({
        action: this.actions[0],
        selected: installDependencies,
      });
    }

    if (this.actions[1]) {
      selectedActions.push({
        action: this.actions[1],
        selected: initializeGit,
      });
    }

    for (let { action, selected } of selectedActions) {
      if (!selected) {
        statuses.push(action.createSkippedStatus());
        continue;
      }

      onActionStart?.({
        name: action.name,
        detail: action.detail,
        message: action.message,
      });

      try {
        await action.execute(this.commandExecutor, targetRoot);
        statuses.push(action.createCompletedStatus());
      } catch (error) {
        statuses.push(action.createFailedStatus(error));
      }
    }

    return statuses;
  }
}

export function createPostSetupExecutor(
  commandExecutor: TCommandExecutor,
): TPostSetupExecutor {
  return new PostSetupExecutor(commandExecutor);
}

export function executeCommand(
  command: string,
  args: string[],
  cwd: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let child = spawn(command, args, {
      cwd,
      stdio: ["inherit", "inherit", "pipe"],
    });
    let stderrOutput = "";

    if (child.stderr) {
      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (chunk) => {
        stderrOutput += chunk;
        process.stderr.write(chunk);
      });
    }

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (exitCode) => {
      if (exitCode === 0) {
        resolve();
        return;
      }

      let message = stderrOutput.trim();

      // exitCode is null when the process was killed by a signal
      reject(
        new Error(
          message.length > 0
            ? message
            : `${command} exited with code ${exitCode ?? "unknown"}`,
        ),
      );
    });
  });
}
