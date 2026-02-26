/**
 * Infra Generate CI Tool
 *
 * Wraps `npx tsdevstack infra:generate-ci` to regenerate CI workflows.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraGenerateCiTool(server: McpServer): void {
  server.registerTool(
    'infra_generate_ci',
    {
      title: 'Generate CI Workflows',
      description:
        'Regenerate CI workflows from ci.json. No credentials required.',
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => runCommand(['infra:generate-ci']),
  );
}
