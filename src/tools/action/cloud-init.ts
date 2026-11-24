/**
 * Cloud Init Tool
 *
 * Wraps `npx tsdevstack cloud:init` to initialize cloud provider credentials.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';
import { LONG_COMMAND_TIMEOUT_MS } from '../../constants/index.js';

export function registerCloudInitTool(server: McpServer): void {
  server.registerTool(
    'cloud_init',
    {
      title: 'Cloud Init',
      description:
        'Initialize cloud provider credentials for a specific provider (gcp, aws, azure). One-time setup per provider. Provider must be passed as flag to skip interactive prompt. Without env it sets up and tests every environment of the credentials file (on Azure that writes to each: provider registration, resource group, Key Vault); with env only that one, the others are not called. Pass env when adding one environment.',
      inputSchema: {
        provider: z
          .enum(['gcp', 'aws', 'azure'])
          .describe('Cloud provider to initialize'),
        env: z
          .string()
          .optional()
          .describe(
            'Set up and test only this environment (default: every environment of the credentials file)',
          ),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ provider, env }) =>
      runCommand(
        ['cloud:init', `--${provider}`, ...(env ? ['--env', env] : [])],
        LONG_COMMAND_TIMEOUT_MS,
      ),
  );
}
