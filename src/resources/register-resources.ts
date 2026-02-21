/**
 * Register Resources
 *
 * Registers all MCP resources (project state + secrets + kong + guides) with the server.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerProjectStateResources } from './project-state.js';
import { registerSecretsContextResources } from './secrets-context.js';
import { registerKongRoutesResource } from './kong-routes.js';
import { registerGuideResource } from './guide.js';
import { registerGuideWorkflowsResource } from './guide-workflows.js';
import { registerGuideNestCommonResource } from './guide-nest-common.js';
import { registerGuideConfigResource } from './guide-config.js';

export function registerResources(server: McpServer): void {
  // Dynamic file-read resources (8)
  registerProjectStateResources(server);
  registerSecretsContextResources(server);
  registerKongRoutesResource(server);

  // Guide resources (4)
  registerGuideResource(server);
  registerGuideWorkflowsResource(server);
  registerGuideNestCommonResource(server);
  registerGuideConfigResource(server);
}
