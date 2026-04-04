/**
 * Get Project Config Tool
 *
 * Reads config.json to return the full project configuration.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerGetProjectConfigTool(server: McpServer): void {
  server.registerTool(
    'get_project_config',
    {
      title: 'Get Project Config',
      description:
        'Full project configuration including service names, types, and workspace setup.',
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        const configPath = join(process.cwd(), '.tsdevstack', 'config.json');
        const content = readFileSync(configPath, 'utf-8');
        return {
          content: [{ type: 'text', text: content }],
        };
      } catch {
        return {
          content: [
            {
              type: 'text',
              text: 'config.json not found. Run `npx tsdevstack init` to create a project.',
            },
          ],
          isError: true,
        };
      }
    },
  );
}
