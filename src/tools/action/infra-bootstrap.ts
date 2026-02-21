/**
 * Infra Bootstrap Tool
 *
 * Wraps `npx tsdevstack infra:bootstrap` to bootstrap cloud project.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraBootstrapTool(server: McpServer): void {
  server.tool(
    'infra_bootstrap',
    'Bootstrap cloud project (enable APIs, add roles). One-time setup per environment.',
    {
      env: z.string().describe('Target environment (dev, staging, prod)'),
    },
    {
      title: 'Infra Bootstrap',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ env }) => runCommand(['infra:bootstrap', '--env', env]),
  );
}
