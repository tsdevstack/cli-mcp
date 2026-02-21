/**
 * Remove Service Tool
 *
 * Wraps `npx tsdevstack remove-service` to remove a service locally.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerRemoveServiceTool(server: McpServer): void {
  server.tool(
    'remove_service',
    'Remove a service from the local project (deletes files, updates config). Does NOT remove from cloud — use remove_service_cloud for that.',
    {
      service: z.string().describe('Service name to remove'),
    },
    {
      title: 'Remove Service',
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: false,
    },
    async ({ service }) => runCommand(['remove-service', service]),
  );
}
