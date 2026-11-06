import { describe, it, expect, rs, beforeEach } from '@rstest/core';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

rs.mock('./read-project-file.js', () => ({
  readProjectFile: rs.fn(),
}));

import { readProjectFile } from './read-project-file.js';
import { registerSecretsContextResources } from './secrets-context';

async function readResource(uri: string): Promise<string> {
  const server = new McpServer({ name: 'test', version: '1.0.0' });
  registerSecretsContextResources(server);
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);

  const result = await client.readResource({ uri });

  await client.close();
  await server.close();
  const content = result.contents[0];
  return 'text' in content ? content.text : '';
}

describe('registerSecretsContextResources', () => {
  beforeEach(() => {
    rs.clearAllMocks();
  });

  it('should register without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });

    expect(() => registerSecretsContextResources(server)).not.toThrow();
  });

  it('should show the user secrets without any value', async () => {
    rs.mocked(readProjectFile).mockReturnValue(
      JSON.stringify({
        secrets: { RESEND_API_KEY: 're_live_secret' },
        'offers-service': { STRIPE_API_KEY: 'sk_test_secret' },
      }),
    );

    const text = await readResource('tsdevstack://secrets/user');

    expect(text).toContain('RESEND_API_KEY');
    expect(text).toContain('STRIPE_API_KEY');
    expect(text).not.toContain('_secret');
  });

  it('should show the local secret names and scopes without any value', async () => {
    rs.mocked(readProjectFile).mockReturnValue(
      JSON.stringify({
        $comment: 'generated',
        secrets: { AUTH_SERVICE_API_KEY: 'local_secret_1' },
        'auth-service': {
          secrets: ['AUTH_SERVICE_API_KEY'],
          JWT_PRIVATE_KEY_CURRENT: 'local_secret_2',
        },
      }),
    );

    const text = await readResource('tsdevstack://secrets/names');

    expect(text).toContain('AUTH_SERVICE_API_KEY');
    expect(text).toContain('JWT_PRIVATE_KEY_CURRENT');
    expect(text).not.toContain('local_secret');
  });

  it('should say how to create a missing local secrets file', async () => {
    rs.mocked(readProjectFile).mockReturnValue(null);

    const text = await readResource('tsdevstack://secrets/names');

    expect(text).toContain('generate-secrets');
  });
});
