/**
 * Deploy Kong Tool
 *
 * Wraps `npx tsdevstack infra:deploy-kong` to rebuild and deploy Kong gateway.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerDeployKongTool(server: McpServer): void {
  server.tool(
    'deploy_kong',
    'Rebuild and deploy Kong gateway. Run after changing routes (adding endpoints, changing auth decorators).',
    {
      env: z.string().describe('Target environment (dev, staging, prod)'),
    },
    {
      title: 'Deploy Kong',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ env }) => runCommand(['infra:deploy-kong', '--env', env]),
  );
}
