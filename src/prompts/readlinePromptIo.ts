import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import type { TPromptIO } from './types.js';

export function createReadlinePromptIo(): TPromptIO {
  let readline = createInterface({ input, output });

  return {
    async askText(message, defaultValue) {
      let suffix = defaultValue.length > 0 ? ` (${defaultValue})` : '';
      let answer = await readline.question(`${message}${suffix}: `);

      return answer.trim().length === 0 ? defaultValue : answer.trim();
    },
    async askConfirm(message, defaultValue) {
      let suffix = defaultValue ? 'Y/n' : 'y/N';
      let answer = await readline.question(`${message} (${suffix}): `);
      let normalized = answer.trim().toLowerCase();

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
