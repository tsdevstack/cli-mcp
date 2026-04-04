/**
 * Infra Deploy Tool
 *
 * Wraps `npx tsdevstack infra:deploy` for full infrastructure deployment.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerInfraDeployTool(server: McpServer): void {
  server.registerTool(
    'infra_deploy',
    {
      title: 'Infra Deploy',
      description:
        'Full deployment: Terraform infra (VPC, DB, Redis, storage buckets) + build + push + deploy all services + Kong + LB. Required when adding new services or new storage buckets. Terraform creates cloud buckets (S3/GCS/Azure Blob) and post-Terraform sync pushes STORAGE_BUCKET_* secrets to cloud secret manager. Long-running (30+ min) — advise the user to run `npx tsdevstack infra:deploy --env {env}` in their terminal instead.',
      inputSchema: {
        env: z.string().describe('Target environment (dev, staging, prod)'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ env }) =>
      runCommand(['infra:deploy', '--env', env, '--auto-approve']),
  );
}
