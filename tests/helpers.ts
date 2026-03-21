import assert from 'node:assert/strict';

import type { TPromptIO } from '../src/prompts/types.js';

export function createPromptIoMock(): TPromptIO {
  let answers = ['demo-app', 'demo-directory'];
  let confirmations = [true, false];

  return {
    async askText() {
      let value = answers.shift();

      if (typeof value !== 'string') {
        throw new Error('Missing text answer');
      }

      return value;
    },
    async askConfirm() {
      let value = confirmations.shift();

      if (typeof value !== 'boolean') {
        throw new Error('Missing confirm answer');
      }

      return value;
    },
    async close() {},
  };
}

export function assertContains(container: readonly string[] | string, expected: string) {
  assert.ok(container.includes(expected), `Expected container to include ${JSON.stringify(expected)}`);
}

export function assertNotContains(container: readonly string[] | string, expected: string) {
  assert.ok(!container.includes(expected), `Expected container not to include ${JSON.stringify(expected)}`);
}

export async function assertRejects(action: Promise<unknown>, message?: string) {
  await assert.rejects(action, (error) => {
    assert.ok(error instanceof Error);

    if (typeof message === 'string') {
      assert.equal(error.message, message);
    }

    return true;
  });
}
