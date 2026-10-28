/**
 * Cloud Secrets Set Tool
 *
 * Wraps `npx tsdevstack cloud-secrets:set` to set a single secret in cloud.
 * The value goes in on standard input (--stdin), not as an argument.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';
import { DEFAULT_COMMAND_TIMEOUT_MS } from '../../constants/index.js';

export function registerCloudSecretsSetTool(server: McpServer): void {
  server.registerTool(
    'cloud_secrets_set',
    {
      title: 'Cloud Secrets Set',
      description:
        'Set or update a single secret in cloud. Use for overrides or adding new third-party API keys.',
      inputSchema: {
        key: z.string().describe('Secret key name (e.g. DOMAIN, STRIPE_KEY)'),
        value: z.string().describe('Secret value'),
        env: z.string().describe('Target environment (dev, staging, prod)'),
        service: z
          .string()
          .optional()
          .describe(
            'Service scope (default: auth-service for the auth secrets, shared for the rest)',
          ),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ key, value, env, service }) => {
      const args = [
        'cloud-secrets:set',
        key,
        '--stdin',
        '--env',
        env,
        '--overwrite',
      ];
      if (service) {
        args.push('--service', service);
      }
      return runCommand(args, DEFAULT_COMMAND_TIMEOUT_MS, value);
    },
  );
}
