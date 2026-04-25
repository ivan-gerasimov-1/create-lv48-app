#!/usr/bin/env node

import { runCli } from "#/dist/cli";

runCli().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown CLI error";

  console.error(message);

  process.exitCode = 1;
});
