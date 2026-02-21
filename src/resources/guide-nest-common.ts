/**
 * Nest-Common Guide Resource
 *
 * Practical notes for the nest-common shared library.
 * References the docs-site for the full canonical reference.
 * Registers: tsdevstack://guide/nest-common
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const NEST_COMMON_CONTENT = `# nest-common — Practical Notes

**Full reference:** https://docs.tsdevstack.dev/packages/nest-common

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
- Database pooling → \`createPrismaConnection()\` (not raw pg Pool)

## NEVER use process.env
Always use \`SecretsService\` to read secrets. The secrets system handles provider detection (local/gcp/aws/azure), caching, and service-scoped access.

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
