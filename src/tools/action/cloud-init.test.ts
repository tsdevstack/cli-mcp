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
import { LONG_COMMAND_TIMEOUT_MS } from '../../constants/index.js';
import { registerCloudInitTool } from './cloud-init';

async function callCloudInit(args: Record<string, string>): Promise<void> {
  const server = new McpServer({ name: 'test', version: '1.0.0' });
  registerCloudInitTool(server);
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);

  await client.callTool({ name: 'cloud_init', arguments: args });

  await client.close();
  await server.close();
}

describe('cloud_init tool', () => {
  beforeEach(() => {
    rs.clearAllMocks();
  });

  it('should set up every environment of the provider without env', async () => {
    await callCloudInit({ provider: 'azure' });

    expect(runCommand).toHaveBeenCalledWith(
      ['cloud:init', '--azure'],
      LONG_COMMAND_TIMEOUT_MS,
    );
  });

  it('should set up only the environment it is given', async () => {
    await callCloudInit({ provider: 'azure', env: 'az7' });

    expect(runCommand).toHaveBeenCalledWith(
      ['cloud:init', '--azure', '--env', 'az7'],
      LONG_COMMAND_TIMEOUT_MS,
    );
  });
});
