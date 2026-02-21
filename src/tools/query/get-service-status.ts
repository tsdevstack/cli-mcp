/**
 * Get Service Status Tool
 *
 * Wraps `npx tsdevstack infra:service-status` to check cloud resource status.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerGetServiceStatusTool(server: McpServer): void {
  server.tool(
    'get_service_status',
    'Cloud resource status for a specific service (running, image tag, URL, health).',
    {
      service: z.string().describe('Service name to check status for'),
      env: z.string().describe('Target environment (dev, staging, prod)'),
    },
    {
      title: 'Get Service Status',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ service, env }) =>
      runCommand(['infra:service-status', service, '--env', env]),
  );
}
