/**
 * Run Command Utility
 *
 * Spawns `npx tsdevstack <command>` and captures output.
 * Returns MCP-formatted CallToolResult.
 * `input` goes to the command's standard input (a secret value, with
 * `--stdin`), so it never shows in the process list.
 */

import { execFile } from 'node:child_process';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { DEFAULT_COMMAND_TIMEOUT_MS } from '../constants/index.js';

export function runCommand(
  args: string[],
  timeoutMs: number = DEFAULT_COMMAND_TIMEOUT_MS,
  input?: string,
): Promise<CallToolResult> {
  return new Promise((resolve) => {
    const child = execFile(
      'npx',
      ['tsdevstack', ...args],
      {
        cwd: process.cwd(),
        timeout: timeoutMs,
        maxBuffer: 10 * 1024 * 1024, // 10MB
      },
      (error, stdout, stderr) => {
        const output = [stdout, stderr].filter(Boolean).join('\n');
        resolve({
          content: [{ type: 'text', text: output || 'Command completed.' }],
          isError: error !== null,
        });
      },
    );
    // Nothing can answer a prompt here: close stdin so an interactive prompt
    // fails at once instead of waiting for the timeout
    if (input === undefined) {
      child.stdin?.end();
    } else {
      child.stdin?.end(input);
    }
  });
}
