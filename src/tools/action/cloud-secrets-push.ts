/**
 * Cloud Secrets Push Tool
 *
 * Wraps `npx tsdevstack cloud-secrets:push --skip-user-secrets` to push
 * framework secrets to cloud. The MCP server cannot answer prompts, and
 * user secret values are the user's to set: the user runs the push in their
 * own terminal, where it asks for each one.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';
import { SECRET_VALUES_USER_SETS } from '../../constants/index.js';

export function registerCloudSecretsPushTool(server: McpServer): void {
  server.registerTool(
    'cloud_secrets_push',
    {
      title: 'Cloud Secrets Push',
      description:
        SECRET_VALUES_USER_SETS +
        'This tool pushes the framework secrets only, without prompts: it generates them (keeps ones already in the cloud), derives API_URL, APP_URL and KONG_CORS_ORIGINS once DOMAIN is in the cloud, and lists the user secrets from .secrets.user.json still missing there. Safe to run again.',
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
