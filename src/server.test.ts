import { describe, it, expect } from '@rstest/core';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from './server';

describe('createServer', () => {
  it('should return an McpServer instance', () => {
    const server = createServer();

    expect(server).toBeInstanceOf(McpServer);
  });

  it('should expose the underlying Server instance', () => {
    const server = createServer();

    expect(server.server).toBeDefined();
  });

  it('should not be connected initially', () => {
    const server = createServer();

    expect(server.isConnected()).toBe(false);
  });
});

describe('Integration: tools/list', () => {
  it('should list all 54 tools', async () => {
    const server = createServer();
    const client = new Client({ name: 'test-client', version: '1.0.0' });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);
    await client.connect(clientTransport);

    const result = await client.listTools();

    expect(result.tools.length).toBe(54);

    await client.close();
    await server.close();
  });

  it('should include all query tools', async () => {
    const server = createServer();
    const client = new Client({ name: 'test-client', version: '1.0.0' });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);
    await client.connect(clientTransport);

    const result = await client.listTools();
    const toolNames = result.tools.map((t) => t.name);

    const queryTools = [
      'list_services',
      'list_environments',
      'get_project_config',
      'get_infrastructure_config',
      'get_service_status',
      'list_deployed_services',
      'list_secrets',
      'diff_secrets',
      'get_secret',
      'list_schedulers',
      'plan_db_migrate',
      'infra_plan',
      'infra_status',
    ];

    for (const tool of queryTools) {
      expect(toolNames).toContain(tool);
    }

    await client.close();
    await server.close();
  });

  it('should include all action tools', async () => {
    const server = createServer();
    const client = new Client({ name: 'test-client', version: '1.0.0' });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);
    await client.connect(clientTransport);

    const result = await client.listTools();
    const toolNames = result.tools.map((t) => t.name);

    const actionTools = [
      // Local
      'sync',
      'generate_secrets',
      'generate_kong',
      'generate_docker_compose',
      'add_service',
      'remove_service',
      'generate_client',
      'register_detached_worker',
      'unregister_detached_worker',
      // Cloud
      'cloud_secrets_push',
      'cloud_secrets_set',
      'cloud_secrets_remove',
      'infra_deploy',
      'deploy_services',
      'deploy_kong',
      'deploy_lb',
      'run_db_migrate',
      'deploy_schedulers',
      'remove_service_cloud',
      'remove_detached_worker',
      'infra_destroy',
      // Setup/CI/internal
      'cloud_init',
      'infra_bootstrap',
      'infra_init',
      'infra_generate',
      'infra_generate_docker',
      'infra_build_docker',
      'infra_push_docker',
      'infra_build_kong',
      'infra_init_ci',
      'infra_generate_ci',
      'deploy_service',
      'deploy_scheduler',
      'remove_scheduler',
      'validate_service',
    ];

    for (const tool of actionTools) {
      expect(toolNames).toContain(tool);
    }

    await client.close();
    await server.close();
  });

  it('should have correct annotations on destructive tools', async () => {
    const server = createServer();
    const client = new Client({ name: 'test-client', version: '1.0.0' });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);
    await client.connect(clientTransport);

    const result = await client.listTools();
    const toolsByName = new Map(result.tools.map((t) => [t.name, t]));

    const destructiveTools = [
      'remove_service',
      'cloud_secrets_remove',
      'remove_service_cloud',
      'remove_detached_worker',
      'infra_destroy',
      'remove_scheduler',
    ];

    for (const name of destructiveTools) {
      const tool = toolsByName.get(name);
      expect(tool).toBeDefined();
      expect(tool?.annotations?.destructiveHint).toBe(true);
    }

    await client.close();
    await server.close();
  });

  it('should have correct annotations on read-only tools', async () => {
    const server = createServer();
    const client = new Client({ name: 'test-client', version: '1.0.0' });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);
    await client.connect(clientTransport);

    const result = await client.listTools();
    const toolsByName = new Map(result.tools.map((t) => [t.name, t]));

    const readOnlyTools = [
      'list_services',
      'list_environments',
      'get_project_config',
      'get_infrastructure_config',
      'get_service_status',
      'list_deployed_services',
      'list_secrets',
      'diff_secrets',
      'get_secret',
      'list_schedulers',
      'plan_db_migrate',
      'infra_plan',
      'infra_status',
      'validate_service',
    ];

    for (const name of readOnlyTools) {
      const tool = toolsByName.get(name);
      expect(tool).toBeDefined();
      expect(tool?.annotations?.readOnlyHint).toBe(true);
    }

    await client.close();
    await server.close();
  });
});

describe('Integration: resources/list', () => {
  it('should list all 12 resources', async () => {
    const server = createServer();
    const client = new Client({ name: 'test-client', version: '1.0.0' });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);
    await client.connect(clientTransport);

    const result = await client.listResources();

    expect(result.resources.length).toBe(12);

    await client.close();
    await server.close();
  });

  it('should include all expected resource URIs', async () => {
    const server = createServer();
    const client = new Client({ name: 'test-client', version: '1.0.0' });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);
    await client.connect(clientTransport);

    const result = await client.listResources();
    const uris = result.resources.map((r) => r.uri);

    const expectedUris = [
      'tsdevstack://config',
      'tsdevstack://infrastructure',
      'tsdevstack://infrastructure-schema',
      'tsdevstack://ci',
      'tsdevstack://secrets/map',
      'tsdevstack://secrets/names',
      'tsdevstack://secrets/user',
      'tsdevstack://kong/routes',
      'tsdevstack://guide',
      'tsdevstack://guide/workflows',
      'tsdevstack://guide/nest-common',
      'tsdevstack://guide/config',
    ];

    for (const uri of expectedUris) {
      expect(uris).toContain(uri);
    }

    await client.close();
    await server.close();
  });
});
