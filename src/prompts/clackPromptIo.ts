import { cancel, confirm, isCancel, select, text } from "@clack/prompts";
import type { TPromptIO } from "./types.js";

export function createClackPromptIo(): TPromptIO {
  return {
    async askText(message, defaultValue) {
      let answer = await text({
        message,
        initialValue: defaultValue,
      });

      if (isCancel(answer)) {
        cancel("Operation cancelled");
        process.exit(1);
      }

      if (typeof answer !== "string") {
        cancel("Operation cancelled");
        process.exit(1);
      }

      return answer;
    },
    async askConfirm(message, defaultValue) {
      let answer = await confirm({
        message,
        initialValue: defaultValue,
      });

      if (isCancel(answer)) {
        cancel("Operation cancelled");
        process.exit(1);
      }

      return answer;
    },
    async askSelect(message, options, defaultValue) {
      let answer = await select({
        message,
        options: options.map((opt) => ({ value: opt.value, label: opt.label })),
        initialValue: defaultValue,
      });

      if (isCancel(answer)) {
        cancel("Operation cancelled");
        process.exit(1);
      }

      if (typeof answer !== "string") {
        cancel("Operation cancelled");
        process.exit(1);
      }

      return answer;
    },
    async close() {
      // Clack doesn't require explicit cleanup
    },
  };
}
