/**
 * Infra Init Tool
 *
 * Wraps `npx tsdevstack infra:init` to initialize infrastructure.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraInitTool(server: McpServer): void {
  server.registerTool(
    'infra_init',
    {
      title: 'Infra Init',
      description:
        'Initialize infrastructure (creates Terraform state bucket). One-time setup per environment.',
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
    async ({ env }) => runCommand(['infra:init', '--env', env]),
  );
}
