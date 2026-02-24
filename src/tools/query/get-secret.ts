/**
 * Get Secret Tool
 *
 * Wraps `npx tsdevstack cloud-secrets:get` to retrieve a single secret value.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerGetSecretTool(server: McpServer): void {
  server.registerTool(
    'get_secret',
    {
      title: 'Get Secret',
      description:
        'Get a single secret value from cloud. Use to check if a secret is set (e.g., DOMAIN). Returns the value — use with care.',
      inputSchema: {
        key: z
          .string()
          .describe('Secret key name (e.g., DOMAIN, RESEND_API_KEY)'),
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ key, env }) =>
      runCommand(['cloud-secrets:get', key, '--env', env]),
  );
}
