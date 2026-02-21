/**
 * Deploy LB Tool
 *
 * Wraps `npx tsdevstack infra:deploy-lb` to deploy/update the load balancer.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerDeployLbTool(server: McpServer): void {
  server.tool(
    'deploy_lb',
    'Deploy/update the load balancer. Run after changing domains or adding frontend apps. Outputs DNS records and SSL validation info.',
    {
      env: z.string().describe('Target environment (dev, staging, prod)'),
    },
    {
      title: 'Deploy Load Balancer',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ env }) =>
      runCommand(['infra:deploy-lb', '--env', env, '--auto-approve']),
  );
}
