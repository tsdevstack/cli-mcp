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
import { registerCloudSecretsCleanupTool } from './cloud-secrets-cleanup';

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

describe('cloud_secrets_cleanup tool', () => {
  beforeEach(() => {
    rs.clearAllMocks();
  });

  it('should delete without the prompt, since nothing can answer it over MCP', async () => {
    await callTool(registerCloudSecretsCleanupTool, 'cloud_secrets_cleanup');

    expect(runCommand).toHaveBeenCalledWith([
      'cloud-secrets:cleanup',
      '--env',
      'prod',
      '--force',
    ]);
  });
});
