import { describe, it, expect } from "vitest";

import {
  buildInitializationSummary,
  formatInitializationSummary,
} from "./summary";

describe("initialization summary", () => {
  it("builds a final summary with manual next steps when post-setup fails", () => {
    let summary = buildInitializationSummary({
      projectName: "demo-app",
      targetDirectory: "demo-app",
      record: {
        createdDirectories: ["/tmp/demo-app"],
        createdFiles: ["/tmp/demo-app/package.json"],
      },
      postSetup: [
        {
          name: "installDependencies",
          selected: true,
          ok: false,
          detail: "npm install failed: timeout",
        },
      ],
    });

    expect(summary.nextSteps).toEqual([
      "cd demo-app",
      "Review the failed optional steps above and rerun them manually if needed.",
    ]);
    expect(formatInitializationSummary(summary)).contains(
      "installDependencies: FAILED",
    );
  });
});
