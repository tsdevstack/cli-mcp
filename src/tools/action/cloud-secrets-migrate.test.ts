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
import { registerCloudSecretsMigrateTool } from './cloud-secrets-migrate';

async function callTool(
  register: (server: McpServer) => void,
  name: string,
): Promise<void> {
  const server = new McpServer({ name: 'test', version: '1.0.0' });
  register(server);
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);

  await client.callTool({ name, arguments: { env: 'prod' } });

  await client.close();
  await server.close();
}

describe('cloud_secrets_migrate tool', () => {
  beforeEach(() => {
    rs.clearAllMocks();
  });

  it('should copy the secrets of the environment', async () => {
    await callTool(registerCloudSecretsMigrateTool, 'cloud_secrets_migrate');

    expect(runCommand).toHaveBeenCalledWith([
      'cloud-secrets:migrate',
      '--env',
      'prod',
    ]);
  });
});
