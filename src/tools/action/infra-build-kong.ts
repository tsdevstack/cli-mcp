/**
 * Infra Build Kong Tool
 *
 * Wraps `npx tsdevstack infra:build-kong` to build Kong Docker image.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraBuildKongTool(server: McpServer): void {
  server.registerTool(
    'infra_build_kong',
    {
      title: 'Build Kong Image',
      description:
        'Build Kong Docker image. Usually called internally by deploy-kong.',
      inputSchema: {
        env: z.string().optional().describe('Target environment (optional)'),
        tag: z.string().optional().describe('Image tag (defaults to git SHA)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ env, tag }) => {
      const args = ['infra:build-kong'];
      if (env) {
        args.push('--env', env);
      }
      if (tag) {
        args.push('--tag', tag);
      }
      return runCommand(args);
    },
  );
}
