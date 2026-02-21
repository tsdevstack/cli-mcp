import { describe, it, expect } from '@rstest/core';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerSecretsContextResources } from './secrets-context';

describe('registerSecretsContextResources', () => {
  it('should register without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });

    expect(() => registerSecretsContextResources(server)).not.toThrow();
  });
});
