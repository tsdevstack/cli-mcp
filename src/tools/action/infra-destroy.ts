/**
 * Infra Destroy Tool
 *
 * Wraps `npx tsdevstack infra:destroy` to destroy all cloud infrastructure.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraDestroyTool(server: McpServer): void {
  server.registerTool(
    'infra_destroy',
    {
      title: 'Infra Destroy',
      description:
        'Destroy ALL cloud infrastructure for an environment. Permanently deletes databases, services, and all data. Cannot be undone. Use with extreme caution.',
      inputSchema: {
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ env }) =>
      runCommand(['infra:destroy', '--env', env, '--auto-approve']),
  );
}
