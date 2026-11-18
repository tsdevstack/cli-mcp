/**
 * Restore Database Tool
 *
 * Wraps `npx tsdevstack infra:restore-database` to replace a service's
 * database with a saved file.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';
import { LONG_COMMAND_TIMEOUT_MS } from '../../constants/index.js';

export function registerRestoreDatabaseTool(server: McpServer): void {
  server.registerTool(
    'restore_database',
    {
      title: 'Restore Database',
      description: `Replace a service's database in one cloud environment with a saved file: one infra:remove-service saved before dropping it, or one a restore saved. The service must be deployed (after a removal: cloud_secrets_push, then infra_deploy). The current contents are saved first ({service}/{time}-before-restore.dump), so a restore is undone by restoring that file. Without file: the newest file from a removal. The service gets database errors while it runs. Ask the user before calling.

Follow-up (suggest to the user): if the service's migrations are newer than the file, run run_db_migrate for the service.`,
      inputSchema: {
        service: z.string().describe('Service whose database to restore'),
        env: z.string().describe('Target environment (dev, staging, prod)'),
        file: z
          .string()
          .optional()
          .describe(
            "The saved file's name in the bucket ({service}/{time}-{reason}.dump)",
          ),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ service, env, file }) =>
      runCommand(
        [
          'infra:restore-database',
          service,
          '--env',
          env,
          '--confirm',
          ...(file ? ['--file', file] : []),
        ],
        LONG_COMMAND_TIMEOUT_MS,
      ),
  );
}
