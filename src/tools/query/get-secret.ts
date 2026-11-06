/**
 * Get Secret Tool
 *
 * Wraps `npx tsdevstack cloud-secrets:get` to retrieve a single secret value.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';
import { GET_SECRET_ASK_FIRST } from '../../constants/index.js';

export function registerGetSecretTool(server: McpServer): void {
  server.registerTool(
    'get_secret',
    {
      title: 'Get Secret',
      description:
        GET_SECRET_ASK_FIRST +
        'Get a single secret value from cloud. To check only whether a secret exists, use list_secrets or diff_secrets: they return names, not values. ' +
        'Never repeat the value in your answer, files, commits or messages unless the user asks you to.',
      inputSchema: {
        key: z
          .string()
          .describe('Secret key name (e.g., DOMAIN, RESEND_API_KEY)'),
        env: z.string().describe('Target environment (dev, staging, prod)'),
        service: z
          .string()
          .optional()
          .describe(
            'Service scope (default: auth-service for the auth secrets, shared for the rest)',
          ),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ key, env, service }) => {
      const args = ['cloud-secrets:get', key, '--env', env];
      if (service) {
        args.push('--service', service);
      }
      return runCommand(args);
    },
  );
}
