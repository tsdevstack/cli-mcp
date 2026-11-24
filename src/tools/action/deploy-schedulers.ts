/**
 * Deploy Schedulers Tool
 *
 * Wraps `npx tsdevstack infra:deploy-schedulers` to deploy all scheduled jobs.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';
import { LONG_COMMAND_TIMEOUT_MS } from '../../constants/index.js';

export function registerDeploySchedulersTool(server: McpServer): void {
  server.registerTool(
    'deploy_schedulers',
    {
      title: 'Deploy Schedulers',
      description:
        'Deploy all scheduled jobs of an environment, both kinds: the schedules, and each cron job with the image its service runs now (a service never deployed stops it: deploy_services first). Run infra_generate first when infrastructure.json changed.',
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
      runCommand(
        ['infra:deploy-schedulers', '--env', env, '--auto-approve'],
        LONG_COMMAND_TIMEOUT_MS,
      ),
  );
}
