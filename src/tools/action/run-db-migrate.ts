/**
 * Run DB Migrate Tool
 *
 * Wraps `npx tsdevstack infra:run-db-migrate` to apply pending migrations.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerRunDbMigrateTool(server: McpServer): void {
  server.registerTool(
    'run_db_migrate',
    {
      title: 'Run DB Migrate',
      description:
        'Apply pending Prisma migrations for a service in cloud. Run plan_db_migrate first to preview changes.',
      inputSchema: {
        service: z.string().describe('Service name with database'),
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ service, env }) =>
      runCommand(['infra:run-db-migrate', '--service', service, '--env', env]),
  );
}
