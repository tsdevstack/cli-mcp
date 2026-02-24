/**
 * Cloud Secrets Remove Tool
 *
 * Wraps `npx tsdevstack cloud-secrets:remove` to remove a secret from cloud.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerCloudSecretsRemoveTool(server: McpServer): void {
  server.registerTool(
    'cloud_secrets_remove',
    {
      title: 'Cloud Secrets Remove',
      description:
        'Remove a secret from cloud secret manager. Verify the secret is unused before removing.',
      inputSchema: {
        key: z.string().describe('Secret key name to remove'),
        env: z.string().describe('Target environment (dev, staging, prod)'),
        service: z
          .string()
          .optional()
          .describe('Service scope (defaults to shared)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ key, env, service }) => {
      const args = ['cloud-secrets:remove', key, '--env', env, '--force'];
      if (service) {
        args.push('--service', service);
      }
      return runCommand(args);
    },
  );
}
