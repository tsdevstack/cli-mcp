/**
 * Remove Detached Worker Tool
 *
 * Wraps `npx tsdevstack infra:remove-detached-worker` to remove a worker from cloud.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerRemoveDetachedWorkerTool(server: McpServer): void {
  server.registerTool(
    'remove_detached_worker',
    {
      title: 'Remove Detached Worker (Cloud)',
      description: 'Remove a detached worker from cloud. Cannot be undone.',
      inputSchema: {
        worker: z.string().describe('Worker name to remove'),
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ worker, env }) =>
      runCommand([
        'infra:remove-detached-worker',
        '--worker',
        worker,
        '--env',
        env,
        '--confirm',
      ]),
  );
}
