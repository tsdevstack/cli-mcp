/**
 * Diff Secrets Tool
 *
 * Wraps `npx tsdevstack cloud-secrets:diff` to compare local vs cloud secrets.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerDiffSecretsTool(server: McpServer): void {
  server.registerTool(
    'diff_secrets',
    {
      title: 'Diff Secrets',
      description:
        "Compare local secret names vs cloud — shows what's missing or extra. Run before deploying to catch mismatches.",
      inputSchema: {
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ env }) => runCommand(['cloud-secrets:diff', '--env', env]),
  );
}
