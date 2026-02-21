/**
 * Register Action Tools
 *
 * Registers all 35 action tools (9 local + 12 cloud + 14 setup/CI/internal) with the MCP server.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Local action tools
import { registerSyncTool } from './sync.js';
import { registerGenerateSecretsTool } from './generate-secrets.js';
import { registerGenerateKongTool } from './generate-kong.js';
import { registerGenerateDockerComposeTool } from './generate-docker-compose.js';
import { registerAddServiceTool } from './add-service.js';
import { registerRemoveServiceTool } from './remove-service.js';
import { registerGenerateClientTool } from './generate-client.js';
import { registerRegisterDetachedWorkerTool } from './register-detached-worker.js';
import { registerUnregisterDetachedWorkerTool } from './unregister-detached-worker.js';

// Cloud action tools
import { registerCloudSecretsPushTool } from './cloud-secrets-push.js';
import { registerCloudSecretsSetTool } from './cloud-secrets-set.js';
import { registerCloudSecretsRemoveTool } from './cloud-secrets-remove.js';
import { registerInfraDeployTool } from './infra-deploy.js';
import { registerDeployServicesTool } from './deploy-services.js';
import { registerDeployKongTool } from './deploy-kong.js';
import { registerDeployLbTool } from './deploy-lb.js';
import { registerRunDbMigrateTool } from './run-db-migrate.js';
import { registerDeploySchedulersTool } from './deploy-schedulers.js';
import { registerRemoveServiceCloudTool } from './remove-service-cloud.js';
import { registerRemoveDetachedWorkerTool } from './remove-detached-worker.js';
import { registerInfraDestroyTool } from './infra-destroy.js';

// Setup/CI/internal action tools
import { registerCloudInitTool } from './cloud-init.js';
import { registerInfraBootstrapTool } from './infra-bootstrap.js';
import { registerInfraInitTool } from './infra-init.js';
import { registerInfraGenerateTool } from './infra-generate.js';
import { registerInfraGenerateDockerTool } from './infra-generate-docker.js';
import { registerInfraBuildDockerTool } from './infra-build-docker.js';
import { registerInfraPushDockerTool } from './infra-push-docker.js';
import { registerInfraBuildKongTool } from './infra-build-kong.js';
import { registerInfraInitCiTool } from './infra-init-ci.js';
import { registerInfraGenerateCiTool } from './infra-generate-ci.js';
import { registerDeployServiceTool } from './deploy-service.js';
import { registerDeploySchedulerTool } from './deploy-scheduler.js';
import { registerRemoveSchedulerTool } from './remove-scheduler.js';
import { registerValidateServiceTool } from './validate-service.js';

export function registerActionTools(server: McpServer): void {
  // Local action tools (low risk)
  registerSyncTool(server);
  registerGenerateSecretsTool(server);
  registerGenerateKongTool(server);
  registerGenerateDockerComposeTool(server);
  registerAddServiceTool(server);
  registerRemoveServiceTool(server);
  registerGenerateClientTool(server);
  registerRegisterDetachedWorkerTool(server);
  registerUnregisterDetachedWorkerTool(server);

  // Cloud action tools (higher risk)
  registerCloudSecretsPushTool(server);
  registerCloudSecretsSetTool(server);
  registerCloudSecretsRemoveTool(server);
  registerInfraDeployTool(server);
  registerDeployServicesTool(server);
  registerDeployKongTool(server);
  registerDeployLbTool(server);
  registerRunDbMigrateTool(server);
  registerDeploySchedulersTool(server);
  registerRemoveServiceCloudTool(server);
  registerRemoveDetachedWorkerTool(server);
  registerInfraDestroyTool(server);

  // Setup/CI/internal action tools
  registerCloudInitTool(server);
  registerInfraBootstrapTool(server);
  registerInfraInitTool(server);
  registerInfraGenerateTool(server);
  registerInfraGenerateDockerTool(server);
  registerInfraBuildDockerTool(server);
  registerInfraPushDockerTool(server);
  registerInfraBuildKongTool(server);
  registerInfraInitCiTool(server);
  registerInfraGenerateCiTool(server);
  registerDeployServiceTool(server);
  registerDeploySchedulerTool(server);
  registerRemoveSchedulerTool(server);
  registerValidateServiceTool(server);
}
