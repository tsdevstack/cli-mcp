/**
 * Run Command Utility
 *
 * Spawns `npx tsdevstack <command>` and captures output.
 * Returns MCP-formatted CallToolResult.
 */

import { execFile } from 'node:child_process';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

const DEFAULT_TIMEOUT_MS = 600_000; // 10 minutes (deploys can be long)

export function runCommand(
  args: string[],
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<CallToolResult> {
  return new Promise((resolve) => {
    execFile(
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
  });
}
