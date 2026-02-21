/**
 * cli-mcp - MCP Server Plugin for tsdevstack CLI
 *
 * Exposes CLI commands as MCP tools so AI agents can manage
 * infrastructure, deploy services, and query project state.
 *
 * Usage in cli.ts:
 *   import { initContext, registerMcpPlugin } from '@tsdevstack/cli-mcp';
 *   initContext(pluginContext);
 *   registerMcpPlugin(program);
 */

// Context initialization - must be called before registerMcpPlugin
export { initContext } from './context/index.js';

// Command registration
export { registerMcpPlugin } from './register-commands.js';
