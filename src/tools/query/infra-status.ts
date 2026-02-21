/**
 * Infra Status Tool
 *
 * Wraps `npx tsdevstack infra:status` to check infrastructure sync status.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraStatusTool(server: McpServer): void {
  server.tool(
    'infra_status',
    'Check if infrastructure configuration is in sync (Terraform state vs config files).',
    {},
    {
      title: 'Infra Status',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async () => runCommand(['infra:status']),
  );
}
