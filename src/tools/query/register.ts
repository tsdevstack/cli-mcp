/**
 * Register Query Tools
 *
 * Registers all 13 read-only (query) tools with the MCP server.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerListServicesTool } from './list-services.js';
import { registerListEnvironmentsTool } from './list-environments.js';
import { registerGetProjectConfigTool } from './get-project-config.js';
import { registerGetInfrastructureConfigTool } from './get-infrastructure-config.js';
import { registerGetServiceStatusTool } from './get-service-status.js';
import { registerListDeployedServicesTool } from './list-deployed-services.js';
import { registerListSecretsTool } from './list-secrets.js';
import { registerDiffSecretsTool } from './diff-secrets.js';
import { registerGetSecretTool } from './get-secret.js';
import { registerListSchedulersTool } from './list-schedulers.js';
import { registerPlanDbMigrateTool } from './plan-db-migrate.js';
import { registerInfraPlanTool } from './infra-plan.js';
import { registerInfraStatusTool } from './infra-status.js';

export function registerQueryTools(server: McpServer): void {
  // File-read tools (no CLI command needed)
  registerListServicesTool(server);
  registerListEnvironmentsTool(server);
  registerGetProjectConfigTool(server);
  registerGetInfrastructureConfigTool(server);

  // CLI-wrapping tools (spawn `npx tsdevstack <command>`)
  registerGetServiceStatusTool(server);
  registerListDeployedServicesTool(server);
  registerListSecretsTool(server);
  registerDiffSecretsTool(server);
  registerGetSecretTool(server);
  registerListSchedulersTool(server);
  registerPlanDbMigrateTool(server);
  registerInfraPlanTool(server);
  registerInfraStatusTool(server);
}
