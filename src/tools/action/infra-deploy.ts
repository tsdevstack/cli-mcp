/**
 * Infra Deploy Tool
 *
 * Wraps `npx tsdevstack infra:deploy` for full infrastructure deployment.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraDeployTool(server: McpServer): void {
  server.tool(
    'infra_deploy',
    'Full deployment: Terraform infra + build + push + deploy all services + Kong + LB. Required when adding new services. Long-running (30+ min) — advise the user to run `npx tsdevstack infra:deploy --env {env}` in their terminal instead.',
    {
      env: z.string().describe('Target environment (dev, staging, prod)'),
    },
    {
      title: 'Infra Deploy',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ env }) =>
      runCommand(['infra:deploy', '--env', env, '--auto-approve']),
  );
}
