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
import { registerRestoreDatabaseTool } from './restore-database';

async function call(args: Record<string, unknown>): Promise<string[]> {
  const server = new McpServer({ name: 'test', version: '1.0.0' });
  registerRestoreDatabaseTool(server);
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  await client.callTool({ name: 'restore_database', arguments: args });
  await client.close();
  await server.close();
  return rs.mocked(runCommand).mock.calls[0][0];
}

describe('restore_database', () => {
  beforeEach(() => {
    rs.clearAllMocks();
  });

  describe('Standard use cases', () => {
    it('should restore the newest file from a removal, without prompts', async () => {
      expect(await call({ service: 'auth-service', env: 'dev' })).toEqual([
        'infra:restore-database',
        'auth-service',
        '--env',
        'dev',
        '--confirm',
      ]);
    });
  });

  describe('Edge cases', () => {
    it('should restore the file it is given', async () => {
      expect(
        await call({
          service: 'auth-service',
          env: 'dev',
          file: 'auth-service/2026-11-14T13-05-00Z-before-restore.dump',
        }),
      ).toEqual([
        'infra:restore-database',
        'auth-service',
        '--env',
        'dev',
        '--confirm',
        '--file',
        'auth-service/2026-11-14T13-05-00Z-before-restore.dump',
      ]);
    });
  });
});
