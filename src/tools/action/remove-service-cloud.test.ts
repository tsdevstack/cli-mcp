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
import { registerRemoveServiceCloudTool } from './remove-service-cloud';

async function call(args: Record<string, unknown>): Promise<string[]> {
  const server = new McpServer({ name: 'test', version: '1.0.0' });
  registerRemoveServiceCloudTool(server);
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  await client.callTool({ name: 'remove_service_cloud', arguments: args });
  await client.close();
  await server.close();
  return rs.mocked(runCommand).mock.calls[0][0];
}

describe('remove_service_cloud', () => {
  beforeEach(() => {
    rs.clearAllMocks();
  });

  describe('Standard use cases', () => {
    it('should remove the service without prompts, saving its database', async () => {
      expect(await call({ service: 'auth-service', env: 'dev' })).toEqual([
        'infra:remove-service',
        'auth-service',
        '--env',
        'dev',
        '--confirm',
      ]);
    });
  });

  describe('Edge cases', () => {
    it('should drop the database without saving it when asked', async () => {
      expect(
        await call({ service: 'auth-service', env: 'dev', skipExport: true }),
      ).toContain('--skip-export');
    });
  });
});
