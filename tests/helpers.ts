import { expect } from "vitest";

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

export function assertContains(
  container: readonly string[] | string,
  expected: string,
) {
  expect(container.includes(expected)).toBe(true);
}

export function assertNotContains(
  container: readonly string[] | string,
  expected: string,
) {
  expect(container.includes(expected)).toBe(false);
}

export async function assertRejects(
  action: Promise<unknown>,
  message?: string,
) {
  await expect(action).rejects.toSatisfy((error: unknown) => {
    if (!(error instanceof Error)) {
      return false;
    }

    if (typeof message === "string") {
      return error.message === message;
    }

    return true;
  });
}
