/**
 * Remove Messaging Topic Tool
 *
 * Wraps `npx tsdevstack remove-messaging-topic` to remove an async messaging topic.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerRemoveMessagingTopicTool(server: McpServer): void {
  server.registerTool(
    'remove_messaging_topic',
    {
      title: 'Remove Messaging Topic',
      description: `Remove an async messaging topic from the project.

What it does:
- Removes topic from messaging.topics in config.json
- Runs sync

Does NOT delete stream data in Redis; with no publisher left, the stream doesn't grow. Each subscribing service deletes its own consumer group on the topic once it is deployed without the subscription (within about 15 minutes).`,
      inputSchema: {
        name: z.string().describe('Topic name to remove (e.g. "user-created")'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ name }) => runCommand(['remove-messaging-topic', '--name', name]),
  );
}
