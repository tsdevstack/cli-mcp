/**
 * List Schedulers Tool
 *
 * Wraps `npx tsdevstack infra:list-schedulers` to list scheduled jobs.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerListSchedulersTool(server: McpServer): void {
  server.tool(
    'list_schedulers',
    'Scheduled jobs (cron tasks) and their deployment status.',
    {
      env: z.string().describe('Target environment (dev, staging, prod)'),
    },
    {
      title: 'List Schedulers',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ env }) => runCommand(['infra:list-schedulers', '--env', env]),
  );
}
