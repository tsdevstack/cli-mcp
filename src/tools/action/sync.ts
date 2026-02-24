/**
 * Sync Tool
 *
 * Wraps `npx tsdevstack sync` to regenerate all local config.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerSyncTool(server: McpServer): void {
  server.registerTool(
    'sync',
    {
      title: 'Sync',
      description:
        'Regenerate all local config: secrets, docker-compose, kong, migrations. Run after adding services or changing secrets.',
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => runCommand(['sync']),
  );
}
