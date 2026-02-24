/**
 * Infra Init CI Tool
 *
 * Wraps `npx tsdevstack infra:init-ci` to initialize CI/CD workflows.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraInitCiTool(server: McpServer): void {
  server.registerTool(
    'infra_init_ci',
    {
      title: 'Init CI/CD',
      description:
        'Initialize CI/CD workflows (GitHub Actions). One-time setup.',
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => runCommand(['infra:init-ci', '--github']),
  );
}
