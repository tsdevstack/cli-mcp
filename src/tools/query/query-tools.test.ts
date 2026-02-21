import { describe, it, expect } from '@rstest/core';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerQueryTools } from './register';
import { registerListServicesTool } from './list-services';
import { registerListEnvironmentsTool } from './list-environments';
import { registerGetProjectConfigTool } from './get-project-config';
import { registerGetInfrastructureConfigTool } from './get-infrastructure-config';
import { registerGetServiceStatusTool } from './get-service-status';
import { registerListDeployedServicesTool } from './list-deployed-services';
import { registerListSecretsTool } from './list-secrets';
import { registerDiffSecretsTool } from './diff-secrets';
import { registerGetSecretTool } from './get-secret';
import { registerListSchedulersTool } from './list-schedulers';
import { registerPlanDbMigrateTool } from './plan-db-migrate';
import { registerInfraPlanTool } from './infra-plan';
import { registerInfraStatusTool } from './infra-status';

describe('Query tools registration', () => {
  it('should register all 13 query tools without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });

    expect(() => registerQueryTools(server)).not.toThrow();
  });

  describe('Individual tool registration', () => {
    it('should register list_services tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerListServicesTool(server)).not.toThrow();
    });

    it('should register list_environments tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerListEnvironmentsTool(server)).not.toThrow();
    });

    it('should register get_project_config tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerGetProjectConfigTool(server)).not.toThrow();
    });

    it('should register get_infrastructure_config tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerGetInfrastructureConfigTool(server)).not.toThrow();
    });

    it('should register get_service_status tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerGetServiceStatusTool(server)).not.toThrow();
    });

    it('should register list_deployed_services tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerListDeployedServicesTool(server)).not.toThrow();
    });

    it('should register list_secrets tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerListSecretsTool(server)).not.toThrow();
    });

    it('should register diff_secrets tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerDiffSecretsTool(server)).not.toThrow();
    });

    it('should register get_secret tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerGetSecretTool(server)).not.toThrow();
    });

    it('should register list_schedulers tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerListSchedulersTool(server)).not.toThrow();
    });

    it('should register plan_db_migrate tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerPlanDbMigrateTool(server)).not.toThrow();
    });

    it('should register infra_plan tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerInfraPlanTool(server)).not.toThrow();
    });

    it('should register infra_status tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerInfraStatusTool(server)).not.toThrow();
    });
  });
});
