/**
 * Generate Secrets Tool
 *
 * Wraps `npx tsdevstack generate-secrets` to regenerate local secrets files.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerGenerateSecretsTool(server: McpServer): void {
  server.registerTool(
    'generate_secrets',
    {
      title: 'Generate Secrets',
      description:
        'Regenerate local secrets files. Run after editing .secrets.user.json or after adding/removing storage buckets. Preserves existing JWT keys and passwords. When storage buckets exist, generates STORAGE_ENDPOINT, STORAGE_ACCESS_KEY, STORAGE_SECRET_KEY (for MinIO), and STORAGE_BUCKET_{NAME} for each bucket.',
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => runCommand(['generate-secrets']),
  );
}
