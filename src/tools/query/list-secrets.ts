/**
 * List Secrets Tool
 *
 * Wraps `npx tsdevstack cloud-secrets:list` to list secret names in cloud.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerListSecretsTool(server: McpServer): void {
  server.registerTool(
    'list_secrets',
    {
      title: 'List Secrets',
      description:
        "Secret names stored in a cloud environment's secret manager. Does NOT return values.",
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
    async ({ env }) => runCommand(['cloud-secrets:list', '--env', env]),
  );
}
