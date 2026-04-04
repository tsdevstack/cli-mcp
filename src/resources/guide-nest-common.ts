/**
 * Nest-Common Guide Resource
 *
 * Practical notes for the nest-common shared library.
 * References the docs-site for the full canonical reference.
 * Registers: tsdevstack://guide/nest-common
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const NEST_COMMON_CONTENT = `# nest-common — Practical Notes

**Full reference:** See the docs-site at \`/packages/nest-common\`

These notes supplement the docs-site with AI-agent-specific guidance.

## Key rule: always import from nest-common
NEVER install third-party packages for features nest-common already provides:
- Authentication → \`AuthModule\` (not passport, not custom JWT)
- Redis → \`RedisModule\` (not raw ioredis)
- Logging → \`ObservabilityModule\` (not winston, not pino directly)
- Metrics → \`ObservabilityModule\` (not prom-client directly)
- Rate limiting → \`RateLimitModule\` (not express-rate-limit)
- Background jobs → \`BullConfigModule\` (not raw bullmq setup)
- Email → \`NotificationModule\` (not nodemailer, not resend directly)
- Object storage → \`StorageModule\` (not @aws-sdk/client-s3, not @google-cloud/storage, not @azure/storage-blob)
- Async messaging → \`MessagingModule\` (not raw ioredis streams, not kafka, not rabbitmq)
- Database pooling → \`createPrismaConnection()\` (not raw pg Pool)

## NEVER use process.env
Always use \`SecretsService\` to read secrets. The secrets system handles provider detection (local/gcp/aws/azure), caching, and service-scoped access.

## StorageModule — Object Storage
\`StorageModule\` provides a unified interface for object storage across all providers.

**Setup:**
\`\`\`typescript
// In your app module:
StorageModule.forRoot({ buckets: ['uploads'] })
// Or async:
StorageModule.forRootAsync({ buckets: ['uploads'] })
\`\`\`

**Usage:**
\`\`\`typescript
@InjectStorage('uploads') private storage: StorageProvider

await this.storage.upload('path/file.pdf', buffer, 'application/pdf');
const data = await this.storage.download('path/file.pdf');
const url = await this.storage.getPresignedUrl('path/file.pdf', 3600);
\`\`\`

**StorageProvider methods:** upload, download, downloadStream, delete, list, copy, getMetadata, getPresignedUrl, exists, getNativeClient

**Provider selection:** Automatic from \`SECRETS_PROVIDER\` env var — \`local\`/\`aws\` → S3 adapter (MinIO locally, AWS S3 in cloud), \`gcp\` → GCS adapter, \`azure\` → Azure Blob adapter. No code changes between environments.

**Bucket names at runtime:** Read from \`STORAGE_BUCKET_{NAME}\` secrets (e.g., \`STORAGE_BUCKET_UPLOADS\`). Locally these point to MinIO bucket names, in cloud they point to cloud bucket names (\`{project}-{name}-{env}\`).

**Full reference:** See the docs-site at \`/features/object-storage\` for setup, bucket naming, secrets, and cloud deployment details.

## MessagingModule — Async Messaging
\`MessagingModule\` provides inter-service event broadcasting via Redis Streams. Same Redis instance as BullMQ and caching — no new infrastructure.

**Setup:**
\`\`\`typescript
// Subscribing service:
MessagingModule.forRoot({ consumerGroup: 'offers-service', topics: ['user-created'] })
// Publishing-only service:
MessagingModule.forRoot({ consumerGroup: 'auth-service' })
\`\`\`

**Publishing:**
\`\`\`typescript
@Injectable()
export class AuthService {
  constructor(private messaging: MessagingService) {}
  async register(dto: RegisterDto) {
    const user = await this.usersRepo.save(dto);
    await this.messaging.publish('user-created', { userId: user.id, email: user.email });
    return user;
  }
}
\`\`\`

**Subscribing:**
\`\`\`typescript
@Injectable()
export class UserEventsHandler {
  @OnMessage('user-created')
  async handleUserCreated(message: IncomingMessage): Promise<void> {
    const { userId } = message.data as { userId: string };
    await this.offersRepo.createDefaultProfile(userId);
    // Return = XACK, throw = retry, 3 failures = DLQ
  }
}
\`\`\`

**Options:** consumerGroup (required), topics (subscribe list), maxRetries (default 3), blockTimeMs (default 5000), maxLen (default 10000), claimMinIdleMs (default 60000)

**Messaging vs BullMQ:** Messaging = inter-service pub/sub (every subscriber gets every message). BullMQ = intra-service job queues (one consumer per job). A subscriber might enqueue a BullMQ job for heavy work.

**Full reference:** See the docs-site at \`/features/async-messaging\` for topic management, naming conventions, and flow diagrams.

## generateSwaggerDocs(AppModule)
Generates OpenAPI spec without starting the server. Used internally by CLI commands:
- \`generate_kong\` reads the spec → generates Kong gateway routes
- \`generate_client\` reads the spec → generates TypeScript HTTP client + DTOs
Not typically called by user code, but important to know it exists — this is why OpenAPI decorators drive everything.`;

export function registerGuideNestCommonResource(server: McpServer): void {
  server.resource(
    'guide-nest-common',
    'tsdevstack://guide/nest-common',
    {
      description:
        'Shared library reference: all modules, decorators, bootstrap functions from nest-common, and when to use them.',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: NEST_COMMON_CONTENT,
          mimeType: 'text/markdown',
        },
      ],
    }),
  );
}
