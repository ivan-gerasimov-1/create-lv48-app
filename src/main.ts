#!/usr/bin/env node

import { runCli } from "#/cli";

const UNKNOWN_ERROR_MESSAGE = "Unknown CLI error";

async function main() {
  try {
    await runCli();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE;

    console.error(message);

    process.exitCode = 1;
  }
}

main();
