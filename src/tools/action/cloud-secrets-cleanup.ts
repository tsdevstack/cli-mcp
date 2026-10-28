/**
 * Cloud Secrets Cleanup Tool
 *
 * Wraps `npx tsdevstack cloud-secrets:cleanup` to delete the old copies of
 * moved secrets.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerCloudSecretsCleanupTool(server: McpServer): void {
  server.registerTool(
    'cloud_secrets_cleanup',
    {
      title: 'Cloud Secrets Cleanup',
      description:
        'Delete the old copies cloud_secrets_migrate copied, only those whose new copy has the same value; the output lists the old copies it kept. An old copy whose new copy has a different value is always kept here: the user can delete it by running npx tsdevstack cloud-secrets:cleanup in a terminal, which asks. Run it after infra_deploy has deployed the services with this CLI, never before: on Azure it refuses while a Container App still reads the old copies. Ask the user before running it: the deletion runs without a prompt.',
      inputSchema: {
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ env }) =>
      runCommand(['cloud-secrets:cleanup', '--env', env, '--force']),
  );
}
