/**
 * Register Tools
 *
 * Registers all 48 MCP tools (13 query + 35 action) with the server.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerQueryTools } from './query/register.js';
import { registerActionTools } from './action/register.js';

export function registerTools(server: McpServer): void {
  registerQueryTools(server);
  registerActionTools(server);
}
