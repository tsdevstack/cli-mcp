/**
 * Infra Init CI Tool
 *
 * Wraps `npx tsdevstack infra:init-ci` to initialize CI/CD workflows.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraInitCiTool(server: McpServer): void {
  server.tool(
    'infra_init_ci',
    'Initialize CI/CD workflows (GitHub Actions). One-time setup.',
    {},
    {
      title: 'Init CI/CD',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async () => runCommand(['infra:init-ci', '--github']),
  );
}
