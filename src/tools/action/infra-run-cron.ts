/**
 * Infra Run Cron Tool
 *
 * Wraps `npx tsdevstack infra:run-cron` to start a scheduled job now in the cloud.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';
import { LONG_COMMAND_TIMEOUT_MS } from '../../constants/index.js';

export function registerInfraRunCronTool(server: McpServer): void {
  server.registerTool(
    'infra_run_cron',
    {
      title: 'Run Scheduled Job Now',
      description:
        "Start a scheduled job now in a cloud environment instead of waiting for its schedule, and report the run. A cron job: one run, waited for until it ends; a failed run reports why it failed (the exit code or the platform's reason), without its log lines: read those with get_logs, which asks the user first (on Azure they arrive 1 to 10 minutes after the run). A trigger: AWS and Azure wait for the call's answer; GCP returns once Cloud Scheduler started the call (its result: list_schedulers, get_logs). Fails with the deploy hint when the job isn't deployed (deploy_schedulers). The tool waits at most 90 minutes; a cron job can run up to a day (almost 7 days on GCP). Past that the tool stops waiting and the run goes on in the cloud: check list_schedulers for its end. The run does real work in that environment.",
      inputSchema: {
        job: z.string().describe('Scheduled job name (infrastructure.json)'),
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ job, env }) =>
      // --no-lines: log lines reach an agent only through get_logs (ask first)
      runCommand(
        ['infra:run-cron', '--job', job, '--env', env, '--no-lines'],
        LONG_COMMAND_TIMEOUT_MS,
      ),
  );
}
