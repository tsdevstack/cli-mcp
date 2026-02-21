/**
 * List Services Tool
 *
 * Reads config.json to list all services with their types, ports, and dependencies.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerListServicesTool(server: McpServer): void {
  server.tool(
    'list_services',
    'List all services in the project with their types and ports. Use this first to understand the project.',
    {},
    {
      title: 'List Services',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async () => {
      try {
        const configPath = join(process.cwd(), '.tsdevstack', 'config.json');
        const config = JSON.parse(readFileSync(configPath, 'utf-8')) as {
          services: unknown;
        };
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(config.services, null, 2),
            },
          ],
        };
      } catch {
        return {
          content: [
            {
              type: 'text' as const,
              text: 'config.json not found. Run `npx tsdevstack init` to create a project.',
            },
          ],
          isError: true,
        };
      }
    },
  );
}
