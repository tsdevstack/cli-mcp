/**
 * Validate Service Tool
 *
 * Wraps `npx tsdevstack validate-service` to validate service structure.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerValidateServiceTool(server: McpServer): void {
  server.tool(
    'validate_service',
    'Validate a service follows naming conventions and structure.',
    {
      service: z
        .string()
        .optional()
        .describe('Service name to validate (optional, auto-detects from cwd)'),
    },
    {
      title: 'Validate Service',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ service }) => {
      const args = ['validate-service'];
      if (service) {
        args.push(service);
      }
      return runCommand(args);
    },
  );
}
