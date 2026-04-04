/**
 * Get Infrastructure Config Tool
 *
 * Reads infrastructure.json to return per-environment settings.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerGetInfrastructureConfigTool(server: McpServer): void {
  server.registerTool(
    'get_infrastructure_config',
    {
      title: 'Get Infrastructure Config',
      description:
        'Per-environment infrastructure settings: DB tiers, domains, scaling, custom overrides. This is a user-created file.',
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        const configPath = join(
          process.cwd(),
          '.tsdevstack',
          'infrastructure.json',
        );
        const content = readFileSync(configPath, 'utf-8');
        return {
          content: [{ type: 'text', text: content }],
        };
      } catch {
        return {
          content: [
            {
              type: 'text',
              text: 'infrastructure.json not found. This is a user-created file — see the guide/config resource for how to create it.',
            },
          ],
          isError: true,
        };
      }
    },
  );
}
