/**
 * Register Detached Worker Tool
 *
 * Wraps `npx tsdevstack register-detached-worker` to register a worker in config.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerRegisterDetachedWorkerTool(server: McpServer): void {
  server.registerTool(
    'register_detached_worker',
    {
      title: 'Register Detached Worker',
      description:
        "Register a detached worker in config.json. Only updates config — does NOT scaffold files. User must create worker.ts, worker.module.ts, and processor files manually using nest-common's startWorker(). After registering, run sync then infra_deploy.",
      inputSchema: {
        name: z.string().describe('Worker name (kebab-case)'),
        baseService: z
          .string()
          .describe('Base NestJS service this worker belongs to'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ name, baseService }) =>
      runCommand([
        'register-detached-worker',
        '--name',
        name,
        '--base-service',
        baseService,
      ]),
  );
}
