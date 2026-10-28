/**
 * Cloud Secrets Migrate Tool
 *
 * Wraps `npx tsdevstack cloud-secrets:migrate` to copy secrets an older CLI
 * left in old places to where the services read them.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerCloudSecretsMigrateTool(server: McpServer): void {
  server.registerTool(
    'cloud_secrets_migrate',
    {
      title: 'Cloud Secrets Migrate',
      description:
        "Copy secrets an older CLI left in old places to where the services read them: the auth secrets from shared into the auth-service scope (every provider), and on Azure each service's secrets from the shared vault into its own vault. Never deletes or overwrites; a new copy with a different value is reported. Safe to run again. When upgrading an existing environment, run it before infra_deploy; after the deploy, cloud_secrets_cleanup deletes the old copies.",
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
    async ({ env }) => runCommand(['cloud-secrets:migrate', '--env', env]),
  );
}
