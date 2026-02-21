/**
 * Cloud Init Tool
 *
 * Wraps `npx tsdevstack cloud:init` to initialize cloud provider credentials.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerCloudInitTool(server: McpServer): void {
  server.tool(
    'cloud_init',
    'Initialize cloud provider credentials for a specific provider (gcp, aws, azure). One-time setup per provider. Provider must be passed as flag to skip interactive prompt.',
    {
      provider: z
        .enum(['gcp', 'aws', 'azure'])
        .describe('Cloud provider to initialize'),
    },
    {
      title: 'Cloud Init',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ provider }) => runCommand(['cloud:init', `--${provider}`]),
  );
}
