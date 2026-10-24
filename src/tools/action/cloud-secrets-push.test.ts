import { describe, it, expect, rs, beforeEach } from '@rstest/core';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

rs.mock('../../utils/run-command.js', () => ({
  runCommand: rs.fn(async () => ({
    content: [{ type: 'text', text: 'ok' }],
    isError: false,
  })),
}));

import { runCommand } from '../../utils/run-command.js';
import { registerCloudSecretsPushTool } from './cloud-secrets-push';

describe('cloud_secrets_push tool', () => {
  beforeEach(() => {
    rs.clearAllMocks();
  });

  it('should push without prompts, since nothing can answer them over MCP', async () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });
    registerCloudSecretsPushTool(server);
    const client = new Client({ name: 'test-client', version: '1.0.0' });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await client.connect(clientTransport);

    await client.callTool({
      name: 'cloud_secrets_push',
      arguments: { env: 'prod' },
    });

    expect(runCommand).toHaveBeenCalledWith([
      'cloud-secrets:push',
      '--env',
      'prod',
      '--skip-user-secrets',
    ]);

    await client.close();
    await server.close();
  });
});
