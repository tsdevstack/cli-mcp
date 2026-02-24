/**
 * Deploy LB Tool
 *
 * Wraps `npx tsdevstack infra:deploy-lb` to deploy/update the load balancer.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerDeployLbTool(server: McpServer): void {
  server.registerTool(
    'deploy_lb',
    {
      title: 'Deploy Load Balancer',
      description:
        'Deploy/update the load balancer. Run after changing domains or adding frontend apps. Outputs DNS records and SSL validation info.',
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
      runCommand(['infra:deploy-lb', '--env', env, '--auto-approve']),
  );
}
