import type { PlaceholderValues } from '../generate/types.js';

const PLACEHOLDER_PATTERN = /\{\{([a-zA-Z0-9]+)\}\}/g;

export function interpolatePlaceholders(
  templateContents: string,
  placeholders: PlaceholderValues,
): string {
  return templateContents.replace(PLACEHOLDER_PATTERN, (_match, rawKey: string) => {
    const value = placeholders[rawKey];

    if (value === undefined) {
      throw new Error(`Unresolved placeholder: {{${rawKey}}}`);
    }

    return value;
  });
}
