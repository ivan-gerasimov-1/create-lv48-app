import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { createPromptIoMock } from "#/tests/createPromptIoMock";

import { runCli } from "#/cli";
import { getPackageVersion } from "#/packageRoot";
import { createPromptController } from "#/prompts/promptController";
import { listRelativeFiles, removePaths } from "#/utils/fs";

let cleanupPaths: string[] = [];

afterEach(async () => {
  await removePaths(cleanupPaths);
  cleanupPaths.length = 0;
});

describe("cli", () => {
  it("runs the full CLI flow and prints a final summary", async () => {
    let rootDirectory = await mkdtemp(path.join(os.tmpdir(), "lv48-cli-run-"));
    let messages: string[] = [];

    cleanupPaths.push(rootDirectory);

    await runCli({
      cwd: rootDirectory,
      commandExecutor: async () => {},
      promptController: createPromptController(createPromptIoMock()),
      logger: {
        info(message) {
          messages.push(message);
        },
        debug() {},
        error(message) {
          messages.push(`ERROR: ${message}`);
        },
      },
    });

    expect(
      messages.some((message) =>
        message.includes("create-lv48-app will scaffold"),
      ),
    ).toBe(true);
    expect(
      messages.some((message) =>
        message.includes(
          "Post-setup: installing npm dependencies. This can take a moment...",
        ),
      ),
    ).toBe(true);
    expect(
      await listRelativeFiles(path.join(rootDirectory, "demo-directory")),
    ).contains("apps/web/src/main.tsx");
  });

  it("prints version and exits when --version flag is provided", async () => {
    let rootDirectory = await mkdtemp(
      path.join(os.tmpdir(), "lv48-cli-version-"),
    );
    let messages: string[] = [];

    cleanupPaths.push(rootDirectory);

    await runCli({
      cwd: rootDirectory,
      args: ["--version"],
      logger: {
        info(message) {
          messages.push(message);
        },
        debug() {},
        error(message) {
          messages.push(`ERROR: ${message}`);
        },
      },
    });

    let expectedVersion = await getPackageVersion();
    expect(messages).toContain(expectedVersion);
    expect(messages).not.toContain(
      expect.stringContaining("create-lv48-app will scaffold"),
    );
  });
});
