/**
 * Generate Docker Compose Tool
 *
 * Wraps `npx tsdevstack generate-docker-compose` to regenerate docker-compose.yml.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerGenerateDockerComposeTool(server: McpServer): void {
  server.registerTool(
    'generate_docker_compose',
    {
      title: 'Generate Docker Compose',
      description:
        'Regenerate docker-compose.yml from current config. Run after adding services.',
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => runCommand(['generate-docker-compose']),
  );
}
