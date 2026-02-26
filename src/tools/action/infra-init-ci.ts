/**
 * Infra Init CI Tool
 *
 * Wraps `npx tsdevstack infra:init-ci` to initialize CI/CD workflows.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraInitCiTool(server: McpServer): void {
  server.registerTool(
    'infra_init_ci',
    {
      title: 'Init CI/CD',
      description:
        'Initialize CI/CD workflows (GitHub Actions). No credentials required.',
      inputSchema: {
        envs: z
          .string()
          .optional()
          .describe(
            'Environments (comma-separated, e.g. "dev,prod"). Prompted if not provided.',
          ),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ envs }) => {
      const args = ['infra:init-ci', '--github'];
      if (envs) {
        args.push('--envs', envs);
      }
      return runCommand(args);
    },
  );
}
