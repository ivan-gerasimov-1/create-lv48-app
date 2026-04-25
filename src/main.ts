#!/usr/bin/env node

import { runCli } from "#/cli";

runCli().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown CLI error";

  console.error(message);

  process.exitCode = 1;
});
