/**
 * Infra Plan Tool
 *
 * Wraps `npx tsdevstack infra:plan` to preview infrastructure changes.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraPlanTool(server: McpServer): void {
  server.registerTool(
    'infra_plan',
    {
      title: 'Infra Plan',
      description:
        'Terraform plan — preview infrastructure changes without applying. Always run before `infra_deploy`.',
      inputSchema: {
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ env }) => runCommand(['infra:plan', '--env', env]),
  );
}
