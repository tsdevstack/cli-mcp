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
        'Regenerate Kong gateway config from OpenAPI specs. Run after adding/changing API endpoints or decorators.',
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
