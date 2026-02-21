/**
 * MCP Server Setup
 *
 * Creates and configures the McpServer instance with tools and resources.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTools } from './tools/register-tools.js';
import { registerResources } from './resources/register-resources.js';

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'tsdevstack',
    version: '1.0.0',
  });

  registerTools(server);
  registerResources(server);

  return server;
}
