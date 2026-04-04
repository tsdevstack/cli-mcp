/**
 * Update Messaging Topic Tool
 *
 * Wraps `npx tsdevstack update-messaging-topic` to update publishers/subscribers.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerUpdateMessagingTopicTool(server: McpServer): void {
  server.registerTool(
    'update_messaging_topic',
    {
      title: 'Update Messaging Topic',
      description: `Sets the publishers and subscribers for a topic. Values replace the current list entirely — pass all desired services, not just additions.

For example, if a topic currently has subscribers ["offers-service", "notifications-service"] and you call this with subscribers "offers-service", the result will be ["offers-service"] only — notifications-service is removed.

Always pass the complete desired list for both publishers and subscribers.`,
      inputSchema: {
        name: z.string().describe('Existing topic name (e.g. "user-created")'),
        publishers: z
          .string()
          .optional()
          .describe(
            'Comma-separated list of ALL desired publishing services (replaces current list entirely). NestJS services only.',
          ),
        subscribers: z
          .string()
          .optional()
          .describe(
            'Comma-separated list of ALL desired subscribing services (replaces current list entirely). NestJS services only.',
          ),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ name, publishers, subscribers }) => {
      const args = ['update-messaging-topic', '--name', name];
      if (publishers) {
        args.push('--publishers', publishers);
      }
      if (subscribers) {
        args.push('--subscribers', subscribers);
      }
      return runCommand(args);
    },
  );
}
