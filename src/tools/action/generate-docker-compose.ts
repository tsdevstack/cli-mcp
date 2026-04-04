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
        'Regenerate docker-compose.yml from current config. Run after adding services or storage buckets. When storage buckets exist in config.json, includes MinIO (S3-compatible storage) on ports 9000 (API) + 9001 (console) with a minio-init job that auto-creates buckets.',
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
