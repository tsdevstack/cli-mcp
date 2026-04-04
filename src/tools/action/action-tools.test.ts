import { describe, it, expect } from '@rstest/core';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerActionTools } from './register';
import { registerSyncTool } from './sync';
import { registerGenerateSecretsTool } from './generate-secrets';
import { registerGenerateKongTool } from './generate-kong';
import { registerGenerateDockerComposeTool } from './generate-docker-compose';
import { registerAddServiceTool } from './add-service';
import { registerRemoveServiceTool } from './remove-service';
import { registerGenerateClientTool } from './generate-client';
import { registerRegisterDetachedWorkerTool } from './register-detached-worker';
import { registerUnregisterDetachedWorkerTool } from './unregister-detached-worker';
import { registerCloudSecretsPushTool } from './cloud-secrets-push';
import { registerCloudSecretsSetTool } from './cloud-secrets-set';
import { registerCloudSecretsRemoveTool } from './cloud-secrets-remove';
import { registerInfraDeployTool } from './infra-deploy';
import { registerDeployServicesTool } from './deploy-services';
import { registerDeployKongTool } from './deploy-kong';
import { registerDeployLbTool } from './deploy-lb';
import { registerRunDbMigrateTool } from './run-db-migrate';
import { registerDeploySchedulersTool } from './deploy-schedulers';
import { registerRemoveServiceCloudTool } from './remove-service-cloud';
import { registerRemoveDetachedWorkerTool } from './remove-detached-worker';
import { registerInfraDestroyTool } from './infra-destroy';
import { registerCloudInitTool } from './cloud-init';
import { registerInfraBootstrapTool } from './infra-bootstrap';
import { registerInfraInitTool } from './infra-init';
import { registerInfraGenerateTool } from './infra-generate';
import { registerInfraGenerateDockerTool } from './infra-generate-docker';
import { registerInfraBuildDockerTool } from './infra-build-docker';
import { registerInfraPushDockerTool } from './infra-push-docker';
import { registerInfraBuildKongTool } from './infra-build-kong';
import { registerInfraInitCiTool } from './infra-init-ci';
import { registerInfraGenerateCiTool } from './infra-generate-ci';
import { registerDeployServiceTool } from './deploy-service';
import { registerDeploySchedulerTool } from './deploy-scheduler';
import { registerRemoveSchedulerTool } from './remove-scheduler';
import { registerValidateServiceTool } from './validate-service';
import { registerAddBucketStorageTool } from './add-bucket-storage';
import { registerRemoveBucketStorageTool } from './remove-bucket-storage';

describe('Action tools registration', () => {
  it('should register all 37 action tools without errors', () => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });

    expect(() => registerActionTools(server)).not.toThrow();
  });

  describe('Local action tools', () => {
    it('should register sync tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerSyncTool(server)).not.toThrow();
    });

    it('should register generate_secrets tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerGenerateSecretsTool(server)).not.toThrow();
    });

    it('should register generate_kong tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerGenerateKongTool(server)).not.toThrow();
    });

    it('should register generate_docker_compose tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerGenerateDockerComposeTool(server)).not.toThrow();
    });

    it('should register add_service tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerAddServiceTool(server)).not.toThrow();
    });

    it('should register remove_service tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerRemoveServiceTool(server)).not.toThrow();
    });

    it('should register generate_client tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerGenerateClientTool(server)).not.toThrow();
    });

    it('should register register_detached_worker tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerRegisterDetachedWorkerTool(server)).not.toThrow();
    });

    it('should register unregister_detached_worker tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerUnregisterDetachedWorkerTool(server)).not.toThrow();
    });

    it('should register add_bucket_storage tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerAddBucketStorageTool(server)).not.toThrow();
    });

    it('should register remove_bucket_storage tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerRemoveBucketStorageTool(server)).not.toThrow();
    });
  });

  describe('Cloud action tools', () => {
    it('should register cloud_secrets_push tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerCloudSecretsPushTool(server)).not.toThrow();
    });

    it('should register cloud_secrets_set tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerCloudSecretsSetTool(server)).not.toThrow();
    });

    it('should register cloud_secrets_remove tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerCloudSecretsRemoveTool(server)).not.toThrow();
    });

    it('should register infra_deploy tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerInfraDeployTool(server)).not.toThrow();
    });

    it('should register deploy_services tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerDeployServicesTool(server)).not.toThrow();
    });

    it('should register deploy_kong tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerDeployKongTool(server)).not.toThrow();
    });

    it('should register deploy_lb tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerDeployLbTool(server)).not.toThrow();
    });

    it('should register run_db_migrate tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerRunDbMigrateTool(server)).not.toThrow();
    });

    it('should register deploy_schedulers tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerDeploySchedulersTool(server)).not.toThrow();
    });

    it('should register remove_service_cloud tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerRemoveServiceCloudTool(server)).not.toThrow();
    });

    it('should register remove_detached_worker tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerRemoveDetachedWorkerTool(server)).not.toThrow();
    });

    it('should register infra_destroy tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerInfraDestroyTool(server)).not.toThrow();
    });
  });

  describe('Setup/CI/internal action tools', () => {
    it('should register cloud_init tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerCloudInitTool(server)).not.toThrow();
    });

    it('should register infra_bootstrap tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerInfraBootstrapTool(server)).not.toThrow();
    });

    it('should register infra_init tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerInfraInitTool(server)).not.toThrow();
    });

    it('should register infra_generate tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerInfraGenerateTool(server)).not.toThrow();
    });

    it('should register infra_generate_docker tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerInfraGenerateDockerTool(server)).not.toThrow();
    });

    it('should register infra_build_docker tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerInfraBuildDockerTool(server)).not.toThrow();
    });

    it('should register infra_push_docker tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerInfraPushDockerTool(server)).not.toThrow();
    });

    it('should register infra_build_kong tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerInfraBuildKongTool(server)).not.toThrow();
    });

    it('should register infra_init_ci tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerInfraInitCiTool(server)).not.toThrow();
    });

    it('should register infra_generate_ci tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerInfraGenerateCiTool(server)).not.toThrow();
    });

    it('should register deploy_service tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerDeployServiceTool(server)).not.toThrow();
    });

    it('should register deploy_scheduler tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerDeploySchedulerTool(server)).not.toThrow();
    });

    it('should register remove_scheduler tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerRemoveSchedulerTool(server)).not.toThrow();
    });

    it('should register validate_service tool', () => {
      const server = new McpServer({ name: 'test', version: '1.0.0' });

      expect(() => registerValidateServiceTool(server)).not.toThrow();
    });
  });
});
