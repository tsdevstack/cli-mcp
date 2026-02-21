/**
 * Infra Generate CI Tool
 *
 * Wraps `npx tsdevstack infra:generate-ci` to regenerate CI workflows.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraGenerateCiTool(server: McpServer): void {
  server.tool(
    'infra_generate_ci',
    'Regenerate CI workflows from ci.json.',
    {
      env: z.string().optional().describe('Target environment (optional)'),
    },
    {
      title: 'Generate CI Workflows',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ env }) => {
      const args = ['infra:generate-ci'];
      if (env) {
        args.push('--env', env);
      }
      return runCommand(args);
    },
  );
}
