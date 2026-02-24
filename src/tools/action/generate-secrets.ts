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
        'Regenerate local secrets files. Run after editing .secrets.user.json. Preserves existing JWT keys and passwords.',
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
