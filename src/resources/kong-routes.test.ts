import { describe, it, expect } from '@rstest/core';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerKongRoutesResource } from './kong-routes';

describe('registerKongRoutesResource', () => {
  it('should register without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });

    expect(() => registerKongRoutesResource(server)).not.toThrow();
  });
});
