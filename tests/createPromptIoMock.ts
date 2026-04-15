import type { TPromptIO } from "../src/prompts/types.js";

export function createPromptIoMock(): TPromptIO {
  let answers = ["demo-app", "demo-directory", "single"];
  let confirmations = [true, false];

  return {
    async askText() {
      let value = answers.shift();

      if (typeof value !== "string") {
        throw new Error("Missing text answer");
      }

      return value;
    },
    async askConfirm() {
      let value = confirmations.shift();

      if (typeof value !== "boolean") {
        throw new Error("Missing confirm answer");
      }

      return value;
    },
    async close() {},
  };
}
