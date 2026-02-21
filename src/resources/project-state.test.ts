import { describe, it, expect } from '@rstest/core';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerProjectStateResources } from './project-state';

describe('registerProjectStateResources', () => {
  it('should register without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });

    expect(() => registerProjectStateResources(server)).not.toThrow();
  });
});
