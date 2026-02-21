/**
 * Infra Generate Tool
 *
 * Wraps `npx tsdevstack infra:generate` to generate Terraform files.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraGenerateTool(server: McpServer): void {
  server.tool(
    'infra_generate',
    'Generate Terraform files from config. Usually called internally by deploy, but useful for previewing generated output.',
    {
      env: z.string().describe('Target environment (dev, staging, prod)'),
    },
    {
      title: 'Infra Generate',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ env }) => runCommand(['infra:generate', '--env', env]),
  );
}
