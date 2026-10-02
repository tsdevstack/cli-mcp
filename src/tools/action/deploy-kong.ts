/**
 * Deploy Kong Tool
 *
 * Wraps `npx tsdevstack infra:deploy-kong` to rebuild and deploy Kong gateway.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerDeployKongTool(server: McpServer): void {
  server.registerTool(
    'deploy_kong',
    {
      title: 'Deploy Kong',
      description:
        'Deploy an already built Kong gateway image (tag defaults to the git SHA). It does not regenerate routes or build the image: after changing routes or kong-plugins/, run infra_generate_kong and infra_build_kong first.',
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
    async ({ env }) => runCommand(['infra:deploy-kong', '--env', env]),
  );
}
