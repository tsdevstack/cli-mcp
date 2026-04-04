/**
 * Kong Routes Resource
 *
 * Dynamic file-read resource for Kong gateway configuration.
 * Registers: tsdevstack://kong/routes
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerKongRoutesResource(server: McpServer): void {
  server.registerResource(
    'kong-routes',
    'tsdevstack://kong/routes',
    {
      description:
        'Current Kong gateway routing config (services, routes, plugins). Shows which endpoints exist, their auth requirements, and which service handles each route.',
    },
    async (uri) => {
      // Try kong.tsdevstack.yml first, fall back to kong.yml
      const cwd = process.cwd();
      let content: string | null = null;

      for (const filename of ['kong.tsdevstack.yml', 'kong.yml']) {
        try {
          content = readFileSync(join(cwd, filename), 'utf-8');
          break;
        } catch {
          // Try next filename
        }
      }

      return {
        contents: [
          {
            uri: uri.href,
            text:
              content ??
              'Kong config not found. Run `npx tsdevstack generate-kong` to generate it.',
            mimeType: 'text/yaml',
          },
        ],
      };
    },
  );
}
