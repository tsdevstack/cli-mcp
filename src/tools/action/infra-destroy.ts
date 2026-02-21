/**
 * Infra Destroy Tool
 *
 * Wraps `npx tsdevstack infra:destroy` to destroy all cloud infrastructure.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraDestroyTool(server: McpServer): void {
  server.tool(
    'infra_destroy',
    'Destroy ALL cloud infrastructure for an environment. Permanently deletes databases, services, and all data. Cannot be undone. Use with extreme caution.',
    {
      env: z.string().describe('Target environment (dev, staging, prod)'),
    },
    {
      title: 'Infra Destroy',
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: false,
    },
    async ({ env }) =>
      runCommand(['infra:destroy', '--env', env, '--auto-approve']),
  );
}
