/**
 * Run Cron Tool
 *
 * Wraps `npx tsdevstack run-cron` to run a scheduled job once locally.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';
import { LONG_COMMAND_TIMEOUT_MS } from '../../constants/index.js';

export function registerRunCronTool(server: McpServer): void {
  server.registerTool(
    'run_cron',
    {
      title: 'Run Scheduled Job Locally',
      description:
        "Run a scheduled job once on the local stack (it must be running: Postgres, Redis). A cron job runs its handler once through the service's cron script and the tool returns its exit code: 0 success or skipped (another run holds the lock), 1 failed or stopped at its timeout, 2 the service has no handler of that name (add it to cron.module.ts). A trigger is called on its service's local port (SchedulerGuard lets local calls through). Waits for the run to end, at most 90 minutes: then the tool stops the command, and the run may stop with it. Run a longer job in a terminal: npx tsdevstack run-cron {name} --service {service}.",
      inputSchema: {
        name: z.string().describe('Scheduled job name'),
        service: z
          .string()
          .optional()
          .describe(
            'Service of the cron job (optional when one service has a handler of that name)',
          ),
        env: z
          .string()
          .optional()
          .describe('Environment whose trigger entry to use (triggers only)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ name, service, env }) => {
      const args = ['run-cron', name];
      if (service) {
        args.push('--service', service);
      }
      if (env) {
        args.push('--env', env);
      }
      return runCommand(args, LONG_COMMAND_TIMEOUT_MS);
    },
  );
}
