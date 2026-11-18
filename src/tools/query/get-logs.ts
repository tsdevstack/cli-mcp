/**
 * Get Logs Tool
 *
 * Wraps `npx tsdevstack infra:logs` to read a deployed environment's logs.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';
import {
  GET_LOGS_ASK_FIRST,
  GET_LOGS_NEWEST_LINES,
  LOG_KIND_VALUES,
  LOG_LEVEL_VALUES,
} from '../../constants/index.js';
import { buildGetLogsArgs } from './build-get-logs-args.js';

export function registerGetLogsTool(server: McpServer): void {
  server.registerTool(
    'get_logs',
    {
      title: 'Get Logs',
      description:
        GET_LOGS_ASK_FIRST +
        'Read the logs of a deployed environment. ' +
        'Without `source` and `all`: lists the log sources (services, workers, frontends, kong, migrate-<service>, db-init (the database setup infra:deploy runs), scheduled jobs, bucket-<name> for the reads and writes of a storage bucket, edge) and when each last logged. ' +
        `With \`source\` or \`all\`: the newest ${GET_LOGS_NEWEST_LINES} lines of the time window (default: the last hour), oldest first, one JSON object per line (time in UTC, source, kind app/platform/edge, level, message, fields). ` +
        'A note at the end says which lines were left out; narrow with since, level, kind or grep to see them. ' +
        '`level` leaves out lines without a level (Kong, frontends, plain text). ' +
        'Use the lines to debug; never copy them into files, commits, issues or messages unless the user asks you to.',
      inputSchema: {
        env: z.string().describe('Target environment (dev, staging, prod)'),
        source: z
          .string()
          .optional()
          .describe('One source by name, as the source list shows it'),
        all: z
          .boolean()
          .optional()
          .describe('Read every source in one timeline'),
        since: z
          .string()
          .optional()
          .describe('Window start: 30m, 1h, 2d or a UTC time (default: 1h)'),
        until: z
          .string()
          .optional()
          .describe('Window end, same format (default: now)'),
        level: z
          .enum(LOG_LEVEL_VALUES)
          .optional()
          .describe('This level and above'),
        kind: z
          .enum(LOG_KIND_VALUES)
          .optional()
          .describe(
            'app (the code), platform (the cloud running it), edge (load balancer, WAF)',
          ),
        grep: z
          .string()
          .optional()
          .describe(
            'Lines that contain this text, any case (an ID, a path, an error)',
          ),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (input) => runCommand(buildGetLogsArgs(input)),
  );
}
