/**
 * Generate Kong Tool
 *
 * Wraps `npx tsdevstack generate-kong` to regenerate Kong gateway config.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerGenerateKongTool(server: McpServer): void {
  server.registerTool(
    'generate_kong',
    {
      title: 'Generate Kong',
      description:
        'Regenerate the local Kong gateway config from the OpenAPI specs (exact routes: only declared paths and methods are routed) and the Kong image build files in infrastructure/kong (generated Dockerfile plus the tsdevstack and kong-plugins/ plugins). Run after adding or changing API endpoints or decorators (regenerate OpenAPI docs first, or use sync), or after editing kong.user.yml or kong-plugins/. Rebuild the gateway image after plugin changes (sync does it).',
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => runCommand(['generate-kong']),
  );
}
