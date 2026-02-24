/**
 * Infra Generate Tool
 *
 * Wraps `npx tsdevstack infra:generate` to generate Terraform files.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraGenerateTool(server: McpServer): void {
  server.registerTool(
    'infra_generate',
    {
      title: 'Infra Generate',
      description:
        'Generate Terraform files from config. Usually called internally by deploy, but useful for previewing generated output.',
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
    async ({ env }) => runCommand(['infra:generate', '--env', env]),
  );
}
