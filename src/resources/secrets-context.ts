/**
 * Secrets Context Resources
 *
 * Dynamic file-read resources for secrets configuration.
 * Registers: tsdevstack://secrets/map, tsdevstack://secrets/names,
 * tsdevstack://secrets/user
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { readProjectFile } from './read-project-file.js';
import { hideSecretValues } from '../utils/hide-secret-values.js';

export function registerSecretsContextResources(server: McpServer): void {
  server.registerResource(
    'secrets-map',
    'tsdevstack://secrets/map',
    {
      description:
        'Keys listed per service in .secrets.user.json. Frontends get exactly these keys at deploy; backends read their shared and their own scope at runtime, whatever is listed.',
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

  server.registerResource(
    'secrets-names',
    'tsdevstack://secrets/names',
    {
      description:
        "Local secret names and scopes from .secrets.local.json (every value hidden): the shared keys (top-level `secrets`) and each service's section.",
    },
    async (uri) => {
      const raw = readProjectFile('.secrets.local.json');
      if (!raw) {
        return {
          contents: [
            {
              uri: uri.href,
              text: '.secrets.local.json not found. Run `npx tsdevstack generate-secrets` to generate it.',
            },
          ],
        };
      }

      // Names and scopes only: never a value
      const namesOnly = hideSecretValues(
        JSON.parse(raw) as Record<string, unknown>,
      );

      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(namesOnly, null, 2),
            mimeType: 'application/json',
          },
        ],
      };
    },
  );

  server.registerResource(
    'secrets-user',
    'tsdevstack://secrets/user',
    {
      description:
        "User secret definitions and service assignments (keys only, every value hidden). Shows which secrets the user has defined: shared (top-level `secrets`) or in a service's own section.",
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

      // Keys and structure only: never a value
      const keysOnly = hideSecretValues(
        JSON.parse(raw) as Record<string, unknown>,
      );

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
