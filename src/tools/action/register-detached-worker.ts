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
        "Register a detached worker in config.json. It also creates whichever of the base service's src/worker.ts, src/worker.module.ts and tsconfig.worker.json are missing, and the start-worker and start-worker:dev scripts; it never overwrites a file and lists what it created and what it left alone. The processor classes are the user's: register each queue in worker.module.ts and add the processor to its providers. Queue processors run only in workers. After registering, run sync then infra_deploy.",
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
