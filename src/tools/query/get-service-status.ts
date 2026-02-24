/**
 * Get Service Status Tool
 *
 * Wraps `npx tsdevstack infra:service-status` to check cloud resource status.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerGetServiceStatusTool(server: McpServer): void {
  server.registerTool(
    'get_service_status',
    {
      title: 'Get Service Status',
      description:
        'Cloud resource status for a specific service (running, image tag, URL, health).',
      inputSchema: {
        service: z.string().describe('Service name to check status for'),
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ service, env }) =>
      runCommand(['infra:service-status', service, '--env', env]),
  );
}
