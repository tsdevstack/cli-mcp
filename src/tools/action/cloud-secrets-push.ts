/**
 * Cloud Secrets Push Tool
 *
 * Wraps `npx tsdevstack cloud-secrets:push --skip-user-secrets` to push
 * framework secrets to cloud. The MCP server cannot answer prompts, so user
 * secrets are set with cloud_secrets_set instead.
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
        'Push framework secrets to cloud, without prompts. Generates fresh framework secrets (keeps ones already in the cloud) and derives API_URL, APP_URL and KONG_CORS_ORIGINS from DOMAIN, so set DOMAIN with cloud_secrets_set first. The output lists user secrets from .secrets.user.json still missing in the cloud (e.g. RESEND_API_KEY, EMAIL_FROM): ask the user for each value and set it with cloud_secrets_set. Safe to run again. Run once per environment during initial setup.',
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
    async ({ env }) =>
      runCommand(['cloud-secrets:push', '--env', env, '--skip-user-secrets']),
  );
}
