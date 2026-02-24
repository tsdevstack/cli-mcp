/**
 * Remove Scheduler Tool
 *
 * Wraps `npx tsdevstack infra:remove-scheduler` to remove a scheduled job from cloud.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerRemoveSchedulerTool(server: McpServer): void {
  server.registerTool(
    'remove_scheduler',
    {
      title: 'Remove Scheduler',
      description:
        'Remove a single scheduled job from cloud. Cannot be undone.',
      inputSchema: {
        job: z.string().optional().describe('Job name to remove (optional)'),
        env: z.string().optional().describe('Target environment (optional)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ job, env }) => {
      const args = ['infra:remove-scheduler'];
      if (job) {
        args.push('--job', job);
      }
      if (env) {
        args.push('--env', env);
      }
      args.push('--confirm');
      return runCommand(args);
    },
  );
}
