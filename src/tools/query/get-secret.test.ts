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
import { registerGetSecretTool } from './get-secret';

async function callGetSecret(args: Record<string, string>): Promise<void> {
  const server = new McpServer({ name: 'test', version: '1.0.0' });
  registerGetSecretTool(server);
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);

  await client.callTool({ name: 'get_secret', arguments: args });

  await client.close();
  await server.close();
}

describe('get_secret tool', () => {
  beforeEach(() => {
    rs.clearAllMocks();
  });

  it("should read a key in a service's scope", async () => {
    await callGetSecret({
      key: 'STRIPE_KEY',
      env: 'prod',
      service: 'offers-service',
    });

    expect(runCommand).toHaveBeenCalledWith([
      'cloud-secrets:get',
      'STRIPE_KEY',
      '--env',
      'prod',
      '--service',
      'offers-service',
    ]);
  });

  it('should use the default scope without a service', async () => {
    await callGetSecret({ key: 'DOMAIN', env: 'dev' });

    expect(runCommand).toHaveBeenCalledWith([
      'cloud-secrets:get',
      'DOMAIN',
      '--env',
      'dev',
    ]);
  });
});
