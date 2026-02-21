import { describe, it, expect } from '@rstest/core';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerGuideResource } from './guide';
import { registerGuideWorkflowsResource } from './guide-workflows';
import { registerGuideNestCommonResource } from './guide-nest-common';
import { registerGuideConfigResource } from './guide-config';

describe('Guide resources', () => {
  it('should register guide resource without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });

    expect(() => registerGuideResource(server)).not.toThrow();
  });

  it('should register guide-workflows resource without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });

    expect(() => registerGuideWorkflowsResource(server)).not.toThrow();
  });

  it('should register guide-nest-common resource without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });

    expect(() => registerGuideNestCommonResource(server)).not.toThrow();
  });

  it('should register guide-config resource without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });

    expect(() => registerGuideConfigResource(server)).not.toThrow();
  });
});
