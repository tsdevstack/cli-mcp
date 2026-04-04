/**
 * List Environments Tool
 *
 * Reads credential files to list configured cloud environments and their providers.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

interface CredentialEnvEntry {
  [key: string]: unknown;
}

export function registerListEnvironmentsTool(server: McpServer): void {
  server.registerTool(
    'list_environments',
    {
      title: 'List Environments',
      description:
        'List configured cloud environments (dev, staging, prod) and their providers.',
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        const tsdevstackDir = join(process.cwd(), '.tsdevstack');
        const files = readdirSync(tsdevstackDir);
        const credentialFiles = files.filter(
          (f) => f.startsWith('.credentials.') && f.endsWith('.json'),
        );

        if (credentialFiles.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'No cloud environments configured. Run `npx tsdevstack cloud:init --gcp|--aws|--azure` to initialize a provider.',
              },
            ],
          };
        }

        const environments: Array<{
          provider: string;
          environments: string[];
        }> = [];

        for (const file of credentialFiles) {
          const provider = file
            .replace('.credentials.', '')
            .replace('.json', '');
          const content = JSON.parse(
            readFileSync(join(tsdevstackDir, file), 'utf-8'),
          ) as CredentialEnvEntry;
          // Extract environment names (keys), never expose credential values
          const envNames = Object.keys(content);
          environments.push({ provider, environments: envNames });
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(environments, null, 2),
            },
          ],
        };
      } catch {
        return {
          content: [
            {
              type: 'text',
              text: 'Could not read credential files. Ensure .tsdevstack/ directory exists.',
            },
          ],
          isError: true,
        };
      }
    },
  );
}
