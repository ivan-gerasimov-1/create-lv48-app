import { describe, it, expect } from "vitest";

import { createPostSetupExecutor } from "./postSetup.js";
import { assertContains } from "../../tests/helpers.js";

describe("post-setup", () => {
  it("initializes git repositories on the main branch when git supports the initial branch flag", async () => {
    let executor = createPostSetupExecutor(async () => {});

    expect(
      await executor.run({
        targetRoot: "/tmp/demo-app",
        installDependencies: false,
        initializeGit: true,
      }),
    ).toEqual([
      {
        name: "installDependencies",
        selected: false,
        ok: true,
        detail: "npm install skipped",
      },
      {
        name: "initializeGit",
        selected: true,
        ok: true,
        detail: "git init completed",
      },
    ]);
  });

  it("falls back to a compatible main-branch setup when git does not support the initial branch flag", async () => {
    let executor = createPostSetupExecutor(async (command, args) => {
      if (
        command === "git" &&
        args[0] === "init" &&
        args[1] === "--initial-branch=main"
      ) {
        throw new Error("error: unknown option `initial-branch=main`");
      }
    });

    expect(
      await executor.run({
        targetRoot: "/tmp/demo-app",
        installDependencies: false,
        initializeGit: true,
      }),
    ).toEqual([
      {
        name: "installDependencies",
        selected: false,
        ok: true,
        detail: "npm install skipped",
      },
      {
        name: "initializeGit",
        selected: true,
        ok: true,
        detail: "git init completed",
      },
    ]);
  });

  it("runs optional post-setup actions and reports failures without hiding scaffold success", async () => {
    let executor = createPostSetupExecutor(async (command) => {
      if (command === "git") {
        throw new Error("git unavailable");
      }
    });

    expect(
      await executor.run({
        targetRoot: "/tmp/demo-app",
        installDependencies: true,
        initializeGit: true,
      }),
    ).toEqual([
      {
        name: "installDependencies",
        selected: true,
        ok: true,
        detail: "npm install completed",
      },
      {
        name: "initializeGit",
        selected: true,
        ok: false,
        detail: "git init failed: git unavailable",
      },
    ]);
  });

  it("emits progress messages before running each selected post-setup action", async () => {
    let started: string[] = [];
    let executor = createPostSetupExecutor(async () => {});

    expect(
      await executor.run({
        targetRoot: "/tmp/demo-app",
        installDependencies: true,
        initializeGit: true,
        onActionStart(action) {
          started.push(action.message);
        },
      }),
    ).toEqual([
      {
        name: "installDependencies",
        selected: true,
        ok: true,
        detail: "npm install completed",
      },
      {
        name: "initializeGit",
        selected: true,
        ok: true,
        detail: "git init completed",
      },
    ]);

    expect(started).toEqual([
      "Post-setup: installing npm dependencies. This can take a moment...",
      "Post-setup: initializing a git repository on branch main...",
    ]);
  });
});
