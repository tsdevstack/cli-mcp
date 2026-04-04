/**
 * Add Bucket Storage Tool
 *
 * Wraps `npx tsdevstack add-bucket-storage` to add a storage bucket.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerAddBucketStorageTool(server: McpServer): void {
  server.registerTool(
    'add_bucket_storage',
    {
      title: 'Add Bucket Storage',
      description: `Add an object storage bucket to the project.

What it does locally:
- Adds bucket to storage.buckets in config.json
- Regenerates docker-compose.yml with MinIO (S3-compatible) container + minio-init job that auto-creates the bucket
- Regenerates secrets with STORAGE_ENDPOINT, STORAGE_ACCESS_KEY, STORAGE_SECRET_KEY, STORAGE_BUCKET_{NAME}
- First bucket also adds MinIO ports 9000 (API) + 9001 (web console) to docker-compose

After running this, tell the user to:
1. Run \`docker compose up -d\` to start MinIO
2. Access MinIO console at http://localhost:9001 (minioadmin/minioadmin)

To use in NestJS code:
- Import StorageModule.forRoot({ buckets: ['bucket-name'] }) in app module
- Inject with @InjectStorage('bucket-name') storage: StorageProvider
- Or inject StorageService for multi-bucket access via storageService.getProvider('bucket-name')
- StorageProvider interface: upload, download, downloadStream, delete, list, copy, getMetadata, getPresignedUrl, exists, getNativeClient

Cloud deployment:
- Run infra_deploy — Terraform creates the cloud bucket (S3 on AWS, GCS on GCP, Azure Blob container on Azure)
- After terraform apply, STORAGE_BUCKET_* names are synced to the cloud secret manager (shared scope)
- No separate STORAGE_PROVIDER env var needed — the storage adapter is derived from SECRETS_PROVIDER at runtime (local/aws→S3, gcp→GCS, azure→Azure Blob)
- Azure also injects AZURE_STORAGE_ACCOUNT_NAME as an env var on Container Apps`,
      inputSchema: {
        name: z
          .string()
          .describe(
            'Bucket logical name (kebab-case, 2-30 chars, e.g. "uploads", "media-assets"). Cloud name derived as {project}-{name}-{env}.',
          ),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ name }) => runCommand(['add-bucket-storage', '--name', name]),
  );
}
