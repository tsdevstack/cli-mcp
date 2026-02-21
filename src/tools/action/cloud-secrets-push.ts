/**
 * Cloud Secrets Push Tool
 *
 * Wraps `npx tsdevstack cloud-secrets:push` to push secrets to cloud.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerCloudSecretsPushTool(server: McpServer): void {
  server.tool(
    'cloud_secrets_push',
    'Push secrets to cloud. Generates framework secrets, prompts for DOMAIN/RESEND_API_KEY/EMAIL_FROM, auto-derives the rest. Run once per environment during initial setup.',
    {
      env: z.string().describe('Target environment (dev, staging, prod)'),
    },
    {
      title: 'Cloud Secrets Push',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ env }) => runCommand(['cloud-secrets:push', '--env', env]),
  );
}
