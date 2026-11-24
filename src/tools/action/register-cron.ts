/**
 * Register Cron Tool
 *
 * Wraps `npx tsdevstack register-cron` to add a cron job to a NestJS service.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerRegisterCronTool(server: McpServer): void {
  server.registerTool(
    'register_cron',
    {
      title: 'Register Cron Job',
      description:
        "Add a cron job to a NestJS service: code that runs on a schedule as its own task, then exits. Creates src/cron/{name}.cron.ts (the handler: write its run() method), and, the first time, src/cron.ts, src/cron.module.ts, tsconfig.cron.json and the cron script; never overwrites. For a second cron job in the same service it prints two lines to add to src/cron.module.ts (the handler's import and its entry in the handlers list): add them. It prints the infrastructure.json entry: add it to scheduledJobs of each environment that should run the job. Then run_cron to try it locally, and infra_generate plus infra_deploy for the cloud. Use a trigger (an endpoint with SchedulerGuard) instead only for short work that must run inside the service's process.",
      inputSchema: {
        service: z
          .string()
          .describe('NestJS service whose code and image run the job'),
        name: z
          .string()
          .describe('Cron job name (kebab-case, at most 40 characters)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ service, name }) =>
      runCommand(['register-cron', '--service', service, '--name', name]),
  );
}
