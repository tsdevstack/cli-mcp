import { HIDDEN_SECRET_VALUE } from '../constants/index.js';

/**
 * Hide the values of a parsed secrets file (.secrets.user.json or
 * .secrets.local.json), keep its structure.
 *
 * The top-level `secrets` object becomes the list of its keys. In a
 * service's section, each value is replaced; lists (the `secrets` array of
 * shared key names a service reads) stay. Keys starting with `$` (`$schema`,
 * the generated file's notes) stay.
 */
export function hideSecretValues(
  parsed: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(parsed)) {
    if (key.startsWith('$')) {
      result[key] = value;
    } else if (
      key === 'secrets' &&
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      result[key] = Object.keys(value);
    } else if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      const section: Record<string, unknown> = {};
      for (const [entryKey, entryValue] of Object.entries(value)) {
        section[entryKey] = Array.isArray(entryValue)
          ? entryValue
          : HIDDEN_SECRET_VALUE;
      }
      result[key] = section;
    } else {
      result[key] = HIDDEN_SECRET_VALUE;
    }
  }

  return result;
}
