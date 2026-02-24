/**
 * Infra Generate Docker Tool
 *
 * Wraps `npx tsdevstack infra:generate-docker` to generate Dockerfiles.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraGenerateDockerTool(server: McpServer): void {
  server.registerTool(
    'infra_generate_docker',
    {
      title: 'Generate Dockerfiles',
      description:
        'Generate Dockerfiles for services. Usually called internally by deploy. Supports optional service filter.',
      inputSchema: {
        service: z
          .string()
          .optional()
          .describe('Generate for specific service only (optional)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ service }) => {
      const args = ['infra:generate-docker'];
      if (service) {
        args.push('--service', service);
      }
      return runCommand(args);
    },
  );
}
