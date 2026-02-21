/**
 * Infra Build Docker Tool
 *
 * Wraps `npx tsdevstack infra:build-docker` to build Docker images.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraBuildDockerTool(server: McpServer): void {
  server.tool(
    'infra_build_docker',
    'Build Docker images with BuildKit. Usually called internally by deploy. Supports --service for single build, --tag for custom tag (defaults to git SHA).',
    {
      service: z
        .string()
        .optional()
        .describe('Build specific service only (optional)'),
      env: z.string().optional().describe('Target environment (optional)'),
      tag: z.string().optional().describe('Image tag (defaults to git SHA)'),
    },
    {
      title: 'Build Docker Images',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ service, env, tag }) => {
      const args = ['infra:build-docker'];
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
