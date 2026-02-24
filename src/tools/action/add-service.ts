/**
 * Add Service Tool
 *
 * Wraps `npx tsdevstack add-service` to add a new service.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerAddServiceTool(server: McpServer): void {
  server.registerTool(
    'add_service',
    {
      title: 'Add Service',
      description:
        'Add a new service (nestjs, nextjs, or spa). After this, run sync to regenerate all config. Types: nestjs (backend API), nextjs (SSR frontend), spa (Rsbuild SPA).',
      inputSchema: {
        name: z
          .string()
          .describe('Service name (kebab-case, e.g. "billing-service")'),
        type: z.enum(['nestjs', 'nextjs', 'spa']).describe('Service type'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ name, type }) =>
      runCommand(['add-service', '--name', name, '--type', type]),
  );
}
