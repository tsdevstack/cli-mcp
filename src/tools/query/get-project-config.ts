/**
 * Get Project Config Tool
 *
 * Reads config.json to return the full project configuration.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerGetProjectConfigTool(server: McpServer): void {
  server.tool(
    'get_project_config',
    'Full project configuration including service names, types, and workspace setup.',
    {},
    {
      title: 'Get Project Config',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async () => {
      try {
        const configPath = join(process.cwd(), '.tsdevstack', 'config.json');
        const content = readFileSync(configPath, 'utf-8');
        return {
          content: [{ type: 'text' as const, text: content }],
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
