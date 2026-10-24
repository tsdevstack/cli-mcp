/**
 * Infra Bootstrap Tool
 *
 * Wraps `npx tsdevstack infra:bootstrap` to bootstrap cloud project.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';
import { LONG_COMMAND_TIMEOUT_MS } from '../../constants/index.js';

export function registerInfraBootstrapTool(server: McpServer): void {
  server.registerTool(
    'infra_bootstrap',
    {
      title: 'Infra Bootstrap',
      description:
        'Bootstrap cloud project (enable APIs, add roles). One-time setup per environment.',
      inputSchema: {
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ env }) =>
      runCommand(['infra:bootstrap', '--env', env], LONG_COMMAND_TIMEOUT_MS),
  );
}
