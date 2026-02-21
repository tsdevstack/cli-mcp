/**
 * Register MCP Plugin Commands
 *
 * Registers the mcp:serve command with the Commander.js program.
 * Called by cli-core after context initialization.
 */

import type { Command } from 'commander';
import { mcpServe } from './mcp-serve.js';
import { wrapCommand } from './context/index.js';

export function registerMcpPlugin(program: Command): void {
  program
    .command('mcp:serve')
    .description('Start MCP server for AI agent integration (stdio transport)')
    .action(
      wrapCommand(async () => {
        await mcpServe();
      }),
    );
}
