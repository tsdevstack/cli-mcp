/**
 * Deploy Service Tool (singular)
 *
 * Wraps `npx tsdevstack infra:deploy-service` to build, push, deploy a single service.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerDeployServiceTool(server: McpServer): void {
  server.registerTool(
    'deploy_service',
    {
      title: 'Deploy Service',
      description:
        'Build, push, deploy a single service (full workflow). Alternative to deploy_services --service. Supports optional tag override.',
      inputSchema: {
        service: z.string().describe('Service name to deploy'),
        env: z.string().optional().describe('Target environment (optional)'),
        tag: z
          .string()
          .optional()
          .describe('Image tag to deploy (defaults to current git SHA)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ service, env, tag }) => {
      const args = ['infra:deploy-service', service];
      if (env) {
        args.push('--env', env);
      }
      if (tag) {
        args.push('--tag', tag);
      }
      return runCommand(args);
    },
  );
}
