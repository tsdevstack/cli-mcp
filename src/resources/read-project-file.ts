/**
 * Read Project File
 *
 * Reads a file relative to the project root (process.cwd()).
 * Returns null if the file doesn't exist.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function readProjectFile(relativePath: string): string | null {
  try {
    return readFileSync(join(process.cwd(), relativePath), 'utf-8');
  } catch {
    return null;
  }
}
