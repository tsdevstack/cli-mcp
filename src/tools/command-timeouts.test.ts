import { describe, it, expect, rs, beforeEach } from '@rstest/core';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

rs.mock('../utils/run-command.js', () => ({
  runCommand: rs.fn(async () => ({
    content: [{ type: 'text', text: 'ok' }],
    isError: false,
  })),
}));

import { runCommand } from '../utils/run-command.js';
import { LONG_COMMAND_TIMEOUT_MS } from '../constants/index.js';
import { registerInfraDeployTool } from './action/infra-deploy';
import { registerInfraDestroyTool } from './action/infra-destroy';
import { registerDeployServicesTool } from './action/deploy-services';
import { registerDeployServiceTool } from './action/deploy-service';
import { registerDeployKongTool } from './action/deploy-kong';
import { registerDeployLbTool } from './action/deploy-lb';
import { registerDeploySchedulersTool } from './action/deploy-schedulers';
import { registerDeploySchedulerTool } from './action/deploy-scheduler';
import { registerInfraBuildDockerTool } from './action/infra-build-docker';
import { registerInfraPushDockerTool } from './action/infra-push-docker';
import { registerInfraBuildKongTool } from './action/infra-build-kong';
import { registerRunDbMigrateTool } from './action/run-db-migrate';
import { registerRemoveServiceCloudTool } from './action/remove-service-cloud';
import { registerRemoveDetachedWorkerTool } from './action/remove-detached-worker';
import { registerInfraInitTool } from './action/infra-init';
import { registerInfraBootstrapTool } from './action/infra-bootstrap';
import { registerCloudInitTool } from './action/cloud-init';
import { registerInfraPlanTool } from './query/infra-plan';
import { registerPlanDbMigrateTool } from './query/plan-db-migrate';
import { registerSyncTool } from './action/sync';

type Register = (server: McpServer) => void;

async function callTool(
  register: Register,
  name: string,
  args: Record<string, string>,
): Promise<void> {
  const server = new McpServer({ name: 'test', version: '1.0.0' });
  register(server);
  const client = new Client({ name: 'test-client', version: '1.0.0' });
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);

  await client.callTool({ name, arguments: args });

  await client.close();
  await server.close();
}

// Tools that build images, run Terraform or cloud jobs, or deploy
const LONG_RUNNING: [Register, string, Record<string, string>][] = [
  [registerInfraDeployTool, 'infra_deploy', { env: 'dev' }],
  [registerInfraDestroyTool, 'infra_destroy', { env: 'dev' }],
  [registerDeployServicesTool, 'deploy_services', { env: 'dev' }],
  [registerDeployServiceTool, 'deploy_service', { service: 'auth-service' }],
  [registerDeployKongTool, 'deploy_kong', { env: 'dev' }],
  [registerDeployLbTool, 'deploy_lb', { env: 'dev' }],
  [registerDeploySchedulersTool, 'deploy_schedulers', { env: 'dev' }],
  [registerDeploySchedulerTool, 'deploy_scheduler', {}],
  [registerInfraBuildDockerTool, 'infra_build_docker', {}],
  [registerInfraPushDockerTool, 'infra_push_docker', {}],
  [registerInfraBuildKongTool, 'infra_build_kong', {}],
  [
    registerRunDbMigrateTool,
    'run_db_migrate',
    { service: 'auth-service', env: 'dev' },
  ],
  [
    registerRemoveServiceCloudTool,
    'remove_service_cloud',
    { service: 'auth-service', env: 'dev' },
  ],
  [
    registerRemoveDetachedWorkerTool,
    'remove_detached_worker',
    { worker: 'auth-worker', env: 'dev' },
  ],
  [registerInfraInitTool, 'infra_init', { env: 'dev' }],
  [registerInfraBootstrapTool, 'infra_bootstrap', { env: 'dev' }],
  [registerCloudInitTool, 'cloud_init', { provider: 'azure' }],
  [registerInfraPlanTool, 'infra_plan', { env: 'dev' }],
  [
    registerPlanDbMigrateTool,
    'plan_db_migrate',
    { service: 'auth-service', env: 'dev' },
  ],
];

describe('MCP command timeouts', () => {
  beforeEach(() => {
    rs.clearAllMocks();
  });

  for (const [register, name, args] of LONG_RUNNING) {
    it(`should give ${name} the long timeout`, async () => {
      await callTool(register, name, args);

      expect(runCommand).toHaveBeenCalledWith(
        expect.any(Array),
        LONG_COMMAND_TIMEOUT_MS,
      );
    });
  }

  it('should keep the default timeout for a local generator', async () => {
    await callTool(registerSyncTool, 'sync', {});

    expect(runCommand).toHaveBeenCalledWith(['sync']);
  });

  it('should allow a first Azure deploy plus capacity retries', () => {
    expect(LONG_COMMAND_TIMEOUT_MS).toBeGreaterThanOrEqual(60 * 60 * 1000);
  });
});
