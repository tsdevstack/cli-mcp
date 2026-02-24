/**
 * Cloud Secrets Push Tool
 *
 * Wraps `npx tsdevstack cloud-secrets:push` to push secrets to cloud.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerCloudSecretsPushTool(server: McpServer): void {
  server.registerTool(
    'cloud_secrets_push',
    {
      title: 'Cloud Secrets Push',
      description:
        'Push secrets to cloud. Generates framework secrets, prompts for DOMAIN/RESEND_API_KEY/EMAIL_FROM, auto-derives the rest. Run once per environment during initial setup.',
      inputSchema: {
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ env }) => runCommand(['cloud-secrets:push', '--env', env]),
  );
}
