/**
 * Add Messaging Topic Tool
 *
 * Wraps `npx tsdevstack add-messaging-topic` to add an async messaging topic.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerAddMessagingTopicTool(server: McpServer): void {
  server.registerTool(
    'add_messaging_topic',
    {
      title: 'Add Messaging Topic',
      description: `Add an async messaging topic to the project.

What it does:
- Adds topic to messaging.topics in config.json with publishers and subscribers
- Validates name (kebab-case, no duplicates, not reserved)
- Validates publisher/subscriber service names exist and are NestJS type
- Runs sync

Service selection: NestJS services only — no frontends, SPAs, or workers. Workers don't have independent module imports; if heavy work is needed, the subscriber handler enqueues a BullMQ job.

To use in NestJS code:
- Publishing service: import MessagingModule.forRoot({ consumerGroup: 'service-name' }) + inject MessagingService + call messaging.publish('topic-name', data)
- Subscribing service: import MessagingModule.forRoot({ consumerGroup: 'service-name', topics: ['topic-name'] }) + create handler class with @OnMessage('topic-name') decorator
- Handler contract: return = XACK (acknowledged), throw = retry (stays pending), 3 failures = DLQ

Infrastructure: No new resources. Uses existing Redis (Docker locally, Memorystore/ElastiCache/Azure Cache in cloud).`,
      inputSchema: {
        name: z
          .string()
          .describe(
            'Topic name (kebab-case, e.g. "user-created", "offer-accepted")',
          ),
        publishers: z
          .string()
          .optional()
          .describe(
            'Comma-separated list of publishing service names (e.g. "auth-service"). NestJS services only.',
          ),
        subscribers: z
          .string()
          .optional()
          .describe(
            'Comma-separated list of subscribing service names (e.g. "offers-service,notifications-service"). NestJS services only.',
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
      const args = ['add-messaging-topic', '--name', name];
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
