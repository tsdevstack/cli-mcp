/**
 * List Schedulers Tool
 *
 * Wraps `npx tsdevstack infra:list-schedulers` to list scheduled jobs.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerListSchedulersTool(server: McpServer): void {
  server.registerTool(
    'list_schedulers',
    {
      title: 'List Schedulers',
      description:
        "Scheduled jobs of both kinds (cron jobs and triggers): each schedule's state and the last run (a cron job's outcome and time).",
      inputSchema: {
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ env }) => runCommand(['infra:list-schedulers', '--env', env]),
  );
}
