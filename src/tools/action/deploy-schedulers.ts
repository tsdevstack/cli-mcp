/**
 * Deploy Schedulers Tool
 *
 * Wraps `npx tsdevstack infra:deploy-schedulers` to deploy all scheduled jobs.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerDeploySchedulersTool(server: McpServer): void {
  server.registerTool(
    'deploy_schedulers',
    {
      title: 'Deploy Schedulers',
      description: 'Deploy all scheduled jobs (cron tasks) to cloud.',
      inputSchema: {
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ env }) =>
      runCommand(['infra:deploy-schedulers', '--env', env, '--auto-approve']),
  );
}
