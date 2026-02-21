/**
 * Remove Detached Worker Tool
 *
 * Wraps `npx tsdevstack infra:remove-detached-worker` to remove a worker from cloud.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerRemoveDetachedWorkerTool(server: McpServer): void {
  server.tool(
    'remove_detached_worker',
    'Remove a detached worker from cloud. Cannot be undone.',
    {
      worker: z.string().describe('Worker name to remove'),
      env: z.string().describe('Target environment (dev, staging, prod)'),
    },
    {
      title: 'Remove Detached Worker (Cloud)',
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: false,
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
