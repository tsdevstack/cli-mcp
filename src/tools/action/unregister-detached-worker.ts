/**
 * Unregister Detached Worker Tool
 *
 * Wraps `npx tsdevstack unregister-detached-worker` to remove a worker from config.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerUnregisterDetachedWorkerTool(server: McpServer): void {
  server.tool(
    'unregister_detached_worker',
    'Remove a detached worker entry from config.json. Does NOT remove from cloud — use remove_detached_worker for that.',
    {
      worker: z.string().describe('Worker name to unregister'),
    },
    {
      title: 'Unregister Detached Worker',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
    async ({ worker }) =>
      runCommand(['unregister-detached-worker', '--worker', worker]),
  );
}
