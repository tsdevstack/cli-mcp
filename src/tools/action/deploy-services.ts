/**
 * Deploy Services Tool
 *
 * Wraps `npx tsdevstack infra:deploy-services` to deploy code changes.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerDeployServicesTool(server: McpServer): void {
  server.tool(
    'deploy_services',
    'Deploy code changes to existing services only. Faster than full deploy. Use for code updates when no infrastructure changes are needed. Supports optional service filter.',
    {
      env: z.string().describe('Target environment (dev, staging, prod)'),
      service: z
        .string()
        .optional()
        .describe(
          'Optional: deploy only this service (or comma-separated list)',
        ),
    },
    {
      title: 'Deploy Services',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ env, service }) => {
      const args = ['infra:deploy-services', '--env', env];
      if (service) {
        args.push('--service', service);
      }
      return runCommand(args);
    },
  );
}
