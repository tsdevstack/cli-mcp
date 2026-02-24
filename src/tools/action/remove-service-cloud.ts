/**
 * Remove Service Cloud Tool
 *
 * Wraps `npx tsdevstack infra:remove-service` to remove a service from cloud.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerRemoveServiceCloudTool(server: McpServer): void {
  server.registerTool(
    'remove_service_cloud',
    {
      title: 'Remove Service (Cloud)',
      description:
        'Remove a service from cloud (deletes container, secrets, database). Cannot be undone. Data is permanently lost.',
      inputSchema: {
        service: z.string().describe('Service name to remove from cloud'),
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ service, env }) =>
      runCommand(['infra:remove-service', service, '--env', env, '--confirm']),
  );
}
