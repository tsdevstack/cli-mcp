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
import { DEFAULT_COMMAND_TIMEOUT_MS } from '../../constants/index.js';
import { registerCloudSecretsSetTool } from './cloud-secrets-set';

describe('cloud_secrets_set tool', () => {
  beforeEach(() => {
    rs.clearAllMocks();
  });

  it('should pass the value on standard input, not as an argument', async () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });
    registerCloudSecretsSetTool(server);
    const client = new Client({ name: 'test-client', version: '1.0.0' });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await client.connect(clientTransport);

    await client.callTool({
      name: 'cloud_secrets_set',
      arguments: {
        key: 'STRIPE_KEY',
        value: 'sk_live_x',
        env: 'prod',
        service: 'offers-service',
      },
    });

    expect(runCommand).toHaveBeenCalledWith(
      [
        'cloud-secrets:set',
        'STRIPE_KEY',
        '--stdin',
        '--env',
        'prod',
        '--overwrite',
        '--service',
        'offers-service',
      ],
      DEFAULT_COMMAND_TIMEOUT_MS,
      'sk_live_x',
    );

    await client.close();
    await server.close();
  });
});
