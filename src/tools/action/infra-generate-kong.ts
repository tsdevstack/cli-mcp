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
        'Generate the cloud Kong config (infrastructure/kong/{env}/kong.yml, with secret placeholders; commit it) from the OpenAPI specs and kong.user.yml. First of three steps for any cloud gateway change: infra_generate_kong, then infra_build_kong, then deploy_kong. infra_deploy runs all three.',
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
