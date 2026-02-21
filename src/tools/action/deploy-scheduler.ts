/**
 * Deploy Scheduler Tool (singular)
 *
 * Wraps `npx tsdevstack infra:deploy-scheduler` to deploy a single scheduled job.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerDeploySchedulerTool(server: McpServer): void {
  server.tool(
    'deploy_scheduler',
    'Deploy a single scheduled job. Alternative to batch deploy_schedulers.',
    {
      job: z
        .string()
        .optional()
        .describe('Scheduled job name to deploy (optional)'),
      env: z.string().optional().describe('Target environment (optional)'),
    },
    {
      title: 'Deploy Scheduler',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ job, env }) => {
      const args = ['infra:deploy-scheduler'];
      if (job) {
        args.push('--job', job);
      }
      if (env) {
        args.push('--env', env);
      }
      args.push('--auto-approve');
      return runCommand(args);
    },
  );
}
