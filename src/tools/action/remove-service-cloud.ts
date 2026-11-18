/**
 * Remove Service Cloud Tool
 *
 * Wraps `npx tsdevstack infra:remove-service` to remove a service from cloud.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';
import { LONG_COMMAND_TIMEOUT_MS } from '../../constants/index.js';

export function registerRemoveServiceCloudTool(server: McpServer): void {
  server.registerTool(
    'remove_service_cloud',
    {
      title: 'Remove Service (Cloud)',
      description: `Remove a service from one cloud environment: its containers, workers, migration job, SPA bucket, secrets and database. Cannot be undone, except the database: the CLI saves it to the environment's exports bucket before dropping it (kept 7 days), and restore_database brings it back once the service is deployed again. skipExport drops the database without saving it: only when the save keeps failing and the user agrees.

Follow-up (suggest to the user): take the service out of the project with remove_service, then run infra_deploy for the same env. The deploy removes the service's Kong routes, its load balancer routes and the scheduled jobs that call it; until then they fail.`,
      inputSchema: {
        service: z.string().describe('Service name to remove from cloud'),
        env: z.string().describe('Target environment (dev, staging, prod)'),
        skipExport: z
          .boolean()
          .optional()
          .describe('Drop the database without saving it first'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ service, env, skipExport }) =>
      runCommand(
        [
          'infra:remove-service',
          service,
          '--env',
          env,
          '--confirm',
          ...(skipExport ? ['--skip-export'] : []),
        ],
        LONG_COMMAND_TIMEOUT_MS,
      ),
  );
}
