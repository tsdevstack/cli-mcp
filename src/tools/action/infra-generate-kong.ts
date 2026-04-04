/**
 * Infra Generate Kong Tool
 *
 * Wraps `npx tsdevstack infra:generate-kong` to generate Kong declarative config.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraGenerateKongTool(server: McpServer): void {
  server.registerTool(
    'infra_generate_kong',
    {
      title: 'Generate Kong Config',
      description:
        'Generate Kong declarative config from OpenAPI specs for cloud deployment. Usually called internally by deploy-kong.',
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
      const args = ['infra:generate-kong'];
      if (env) {
        args.push('--env', env);
      }
      return runCommand(args);
    },
  );
}
