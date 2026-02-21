/**
 * MCP Serve Command Handler
 *
 * Creates the MCP server and connects it to stdio transport.
 * This is the function called by the `mcp:serve` CLI command.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

export async function mcpServe(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
