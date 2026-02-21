/**
 * Cloud Secrets Set Tool
 *
 * Wraps `npx tsdevstack cloud-secrets:set` to set a single secret in cloud.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerCloudSecretsSetTool(server: McpServer): void {
  server.tool(
    'cloud_secrets_set',
    'Set or update a single secret in cloud. Use for overrides or adding new third-party API keys.',
    {
      key: z.string().describe('Secret key name (e.g. DOMAIN, STRIPE_KEY)'),
      value: z.string().describe('Secret value'),
      env: z.string().describe('Target environment (dev, staging, prod)'),
      service: z
        .string()
        .optional()
        .describe('Service scope (defaults to shared)'),
    },
    {
      title: 'Cloud Secrets Set',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ key, value, env, service }) => {
      const args = [
        'cloud-secrets:set',
        key,
        '--value',
        value,
        '--env',
        env,
        '--overwrite',
      ];
      if (service) {
        args.push('--service', service);
      }
      return runCommand(args);
    },
  );
}
