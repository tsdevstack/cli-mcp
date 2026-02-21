/**
 * Deploy Schedulers Tool
 *
 * Wraps `npx tsdevstack infra:deploy-schedulers` to deploy all scheduled jobs.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerDeploySchedulersTool(server: McpServer): void {
  server.tool(
    'deploy_schedulers',
    'Deploy all scheduled jobs (cron tasks) to cloud.',
    {
      env: z.string().describe('Target environment (dev, staging, prod)'),
    },
    {
      title: 'Deploy Schedulers',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ env }) =>
      runCommand(['infra:deploy-schedulers', '--env', env, '--auto-approve']),
  );
}
