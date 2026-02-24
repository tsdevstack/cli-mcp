/**
 * Infra Generate CI Tool
 *
 * Wraps `npx tsdevstack infra:generate-ci` to regenerate CI workflows.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraGenerateCiTool(server: McpServer): void {
  server.registerTool(
    'infra_generate_ci',
    {
      title: 'Generate CI Workflows',
      description: 'Regenerate CI workflows from ci.json.',
      inputSchema: {
        env: z.string().optional().describe('Target environment (optional)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
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
