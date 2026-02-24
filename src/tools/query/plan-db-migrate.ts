/**
 * Plan DB Migrate Tool
 *
 * Wraps `npx tsdevstack infra:plan-db-migrate` to show pending migrations.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerPlanDbMigrateTool(server: McpServer): void {
  server.registerTool(
    'plan_db_migrate',
    {
      title: 'Plan DB Migrate',
      description:
        'Show pending Prisma database migrations for a service. Run before `run_db_migrate` to preview changes.',
      inputSchema: {
        service: z.string().describe('Service name (must have a database)'),
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ service, env }) =>
      runCommand(['infra:plan-db-migrate', '--service', service, '--env', env]),
  );
}
