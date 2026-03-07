import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import type { PromptIO } from './types.js';

export function createReadlinePromptIo(): PromptIO {
  const readline = createInterface({ input, output });

  return {
    async askText(message, defaultValue) {
      const suffix = defaultValue.length > 0 ? ` (${defaultValue})` : '';
      const answer = await readline.question(`${message}${suffix}: `);

      return answer.trim().length === 0 ? defaultValue : answer.trim();
    },
    async askConfirm(message, defaultValue) {
      const suffix = defaultValue ? 'Y/n' : 'y/N';
      const answer = await readline.question(`${message} (${suffix}): `);
      const normalized = answer.trim().toLowerCase();

      if (normalized.length === 0) {
        return defaultValue;
      }

      if (normalized === 'y' || normalized === 'yes') {
        return true;
      }

      if (normalized === 'n' || normalized === 'no') {
        return false;
      }

      return defaultValue;
    },
    async close() {
      readline.close();
    },
  };
}
