/**
 * Remove Bucket Storage Tool
 *
 * Wraps `npx tsdevstack remove-bucket-storage` to remove a storage bucket.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { runCommand } from '../../utils/run-command.js';

export function registerRemoveBucketStorageTool(server: McpServer): void {
  server.registerTool(
    'remove_bucket_storage',
    {
      title: 'Remove Bucket Storage',
      description: `Remove a storage bucket from the project configuration.

What it does locally:
- Removes bucket from storage.buckets in config.json
- Regenerates docker-compose.yml (removes MinIO entirely if last bucket)
- Regenerates secrets (removes STORAGE_* secrets if last bucket)
- Does NOT delete any data from local MinIO — data remains in Docker volume

What it does NOT do:
- Does NOT remove cloud resources (S3 buckets, GCS buckets, Azure Blob containers)
- Does NOT remove STORAGE_BUCKET_* secrets from cloud secret managers
- Does NOT delete any stored files

To clean up cloud resources after removing: run infra_deploy to apply Terraform changes (removes the bucket from Terraform state). WARNING: this deletes all data in the cloud bucket. Consider backing up first.

If removing the last bucket, StorageModule imports in NestJS code must also be removed manually.`,
      inputSchema: {
        name: z
          .string()
          .describe(
            'Bucket logical name to remove (must match a name in config.json storage.buckets)',
          ),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ name }) =>
      runCommand(['remove-bucket-storage', '--name', name, '--force']),
  );
}
