/**
 * Generate Client Tool
 *
 * Wraps `npx tsdevstack generate-client` to generate TypeScript HTTP client + DTOs.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerGenerateClientTool(server: McpServer): void {
  server.tool(
    'generate_client',
    "Generate TypeScript HTTP client + DTOs from a service's OpenAPI spec. Other services import this for type-safe API calls.",
    {
      service: z.string().describe('Service name to generate client for'),
    },
    {
      title: 'Generate Client',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ service }) => runCommand(['generate-client', service]),
  );
}
