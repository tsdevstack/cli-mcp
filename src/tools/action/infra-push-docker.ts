/**
 * Infra Push Docker Tool
 *
 * Wraps `npx tsdevstack infra:push-docker` to push Docker images to registry.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraPushDockerTool(server: McpServer): void {
  server.registerTool(
    'infra_push_docker',
    {
      title: 'Push Docker Images',
      description:
        'Push Docker images to registry. Usually called internally by deploy. Supports --service for single push.',
      inputSchema: {
        service: z
          .string()
          .optional()
          .describe('Push specific service only (optional)'),
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
    async ({ service, env, tag }) => {
      const args = ['infra:push-docker'];
      if (service) {
        args.push('--service', service);
      }
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
