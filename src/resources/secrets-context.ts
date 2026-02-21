/**
 * Secrets Context Resources
 *
 * Dynamic file-read resources for secrets configuration.
 * Registers: tsdevstack://secrets/map, tsdevstack://secrets/names,
 * tsdevstack://secrets/user
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

function readProjectFile(relativePath: string): string | null {
  try {
    return readFileSync(join(process.cwd(), relativePath), 'utf-8');
  } catch {
    return null;
  }
}

export function registerSecretsContextResources(server: McpServer): void {
  server.resource(
    'secrets-map',
    'tsdevstack://secrets/map',
    {
      description:
        'Which secrets are assigned to which services. Critical for debugging "service X doesn\'t have secret Y" issues.',
    },
    async (uri) => {
      const content = readProjectFile('.tsdevstack/secret-map.json');
      return {
        contents: [
          {
            uri: uri.href,
            text:
              content ??
              'secret-map.json not found. Run `npx tsdevstack generate-secrets` to generate it.',
            mimeType: 'application/json',
          },
        ],
      };
    },
  );

  server.resource(
    'secrets-names',
    'tsdevstack://secrets/names',
    {
      description:
        'Secret names, scopes, and values (local dev only — no cloud credentials). Full content of the merged secrets file.',
    },
    async (uri) => {
      const content = readProjectFile('.secrets.local.json');
      return {
        contents: [
          {
            uri: uri.href,
            text:
              content ??
              '.secrets.local.json not found. Run `npx tsdevstack generate-secrets` to generate it.',
            mimeType: 'application/json',
          },
        ],
      };
    },
  );

  server.resource(
    'secrets-user',
    'tsdevstack://secrets/user',
    {
      description:
        'User secret definitions and service assignments (keys only, no values). Shows which secrets the user has defined and which services they are assigned to.',
    },
    async (uri) => {
      const raw = readProjectFile('.secrets.user.json');
      if (!raw) {
        return {
          contents: [
            {
              uri: uri.href,
              text: '.secrets.user.json not found. This file is created when the user adds custom secrets.',
            },
          ],
        };
      }

      // Strip values — only return keys and structure
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const keysOnly: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(parsed)) {
        if (key === 'secrets' && typeof value === 'object' && value !== null) {
          keysOnly[key] = Object.keys(value as Record<string, unknown>);
        } else if (typeof value === 'object' && value !== null) {
          keysOnly[key] = value;
        } else {
          keysOnly[key] = value;
        }
      }

      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(keysOnly, null, 2),
            mimeType: 'application/json',
          },
        ],
      };
    },
  );
}
