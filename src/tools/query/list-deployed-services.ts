/**
 * List Deployed Services Tool
 *
 * Wraps `npx tsdevstack infra:list-deployed` to list all deployed services.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerListDeployedServicesTool(server: McpServer): void {
  server.tool(
    'list_deployed_services',
    'All deployed services in a cloud environment with their current status.',
    {
      env: z.string().describe('Target environment (dev, staging, prod)'),
    },
    {
      title: 'List Deployed Services',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ env }) => runCommand(['infra:list-deployed', '--env', env]),
  );
}
