/**
 * Workflows Guide Resource
 *
 * Hardcoded step-by-step workflow chains for common tasks.
 * Registers: tsdevstack://guide/workflows
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const WORKFLOWS_CONTENT = `# tsdevstack Workflow Reference

## "Add a new backend service"
1. \`add_service\` with name and type=nestjs → scaffolds app in \`apps/{name}/\`, updates config.json
2. \`sync\` → regenerates secrets, docker-compose, kong config, migrations
3. Tell user to run \`npm run dev\` to start locally
4. For cloud: \`infra_deploy --env {env}\` (Terraform must create Cloud Run service)

## "Add a new frontend"
1. \`add_service\` with name and type=nextjs (or spa for React SPA)
2. \`sync\` → regenerates docker-compose
3. Tell user to run \`npm run dev\`
4. For cloud: \`infra_deploy --env {env}\`

## "Add a background job processor (detached worker)"
Workers run as separate containers sharing their base service's Docker image.
1. \`register_detached_worker\` with name and base-service → adds worker entry to config.json
2. User creates these files manually:
   - \`apps/{base-service}/src/worker.ts\` — entry point using \`startWorker()\` from nest-common
   - \`apps/{base-service}/src/worker.module.ts\` — NestJS module importing \`BullConfigModule.forRoot()\` and registering queues
   - \`apps/{base-service}/src/processors/{queue-name}.processor.ts\` — BullMQ processor classes
3. Import \`BullModule.registerQueue({ name: 'queue-name' })\` in the main app module too (so the app can add jobs to the queue)
4. \`sync\` → regenerates config
5. \`infra_deploy --env {env}\` (Terraform must create the worker container)
6. After first deploy, code updates: \`deploy_services --service {base-service}\` (deploys both app and worker)

## "Add an API endpoint"
No CLI command needed — this is code:
1. Add method to NestJS controller
2. Add OpenAPI decorators: \`@ApiOperation({ summary: '...' })\`, \`@ApiResponse({ ... })\`
3. For authentication: add \`@ApiBearerAuth()\` + \`@UseGuards(AuthGuard)\`
4. For partner API access: add \`@PartnerApi()\` (can combine with \`@ApiBearerAuth()\` for dual access)
5. For public endpoints: add \`@Public()\` decorator (or just don't add auth decorators)
6. \`generate_kong\` → regenerates gateway routes from OpenAPI spec
7. \`generate_client\` → regenerates TypeScript client so other services have the new endpoint typed

## "Add a secret to a service"
1. Read \`tsdevstack://secrets/map\` to see current assignments
2. User adds key+value to \`.secrets.user.json\` under \`secrets\` object
3. User adds the key name to the service's \`secrets\` array in \`.secrets.user.json\`
4. \`generate_secrets\` → regenerates merged \`.secrets.local.json\`
5. For cloud: \`cloud_secrets_set\` with the key and env, then \`deploy_services --service {name}\` to restart with new secret

## "Assign a domain to a frontend app"
Only \`nextjs\` and \`spa\` apps can have domains. Backend services are NOT publicly available — they're behind Kong. Kong already has a fixed \`api.{DOMAIN}\` URL.
1. \`get_secret DOMAIN --env {env}\` → check if DOMAIN is set in cloud
2. If DOMAIN is not set: tell user to set it first (\`cloud_secrets_set DOMAIN example.com --env {env}\` or via \`cloud_secrets_push\`)
3. If DOMAIN is set: edit \`infrastructure.json\` → add \`"domain": "example.com"\` to the frontend app's env entry
   - If the app doesn't have an entry in the env config yet, create one: \`"frontend": { "domain": "example.com" }\`
4. For redirect domains (alternate domains that redirect to canonical): add \`"loadBalancer": { "redirectDomains": ["alt.com"] }\` to the env config
5. \`deploy_lb --env {env}\` → deploys/updates load balancer, outputs DNS records and SSL validation info
6. User adds DNS records at their domain registrar (A/CNAME records from the output)
7. Check DNS propagation: \`dig {domain}\` — wait for it to point to the LB IP
8. SSL certificate auto-provisions after DNS propagates

## "Generate a typed HTTP client for service-to-service calls"
1. Ensure target service has proper OpenAPI decorators on all endpoints
2. \`generate_client\` for the target service → generates TypeScript client + DTOs in \`packages/{service}-client/\`
3. In the calling service, create a client class extending \`BaseServiceClient\` from nest-common
4. Inject \`SecretsService\` to get the target service URL and API key
5. The generated client provides full type safety for all endpoints, request bodies, and responses

## "Create infrastructure.json for a new environment"
This file is user-created — the framework does NOT generate it. Only create it if needed (e.g., to override defaults).
Most projects WILL need this because \`minInstances: 0\` (scale to zero) is a common non-prod setting that saves costs.
1. Read \`tsdevstack://config\` to get the list of services
2. Read \`tsdevstack://infrastructure-schema\` to know valid fields and values (only available after \`infra_init\`)
3. Create \`.tsdevstack/infrastructure.json\` with:
   - \`"$schema": "./infrastructure.schema.json"\` (REQUIRED — enables IDE validation)
   - \`"version": "1.0.0"\`
   - Environment key (e.g., \`"dev"\`) containing:
     - Per-service overrides (CPU, memory, minInstances, maxInstances) — service names must match config.json
     - \`database\` settings (tier, deletionProtection, etc.)
     - \`redis\` settings (tier, memoryGb)
     - \`kong\` settings (minInstances, maxInstances, cpu, memory)
     - \`accessControl\` (protected, noIndex)
     - \`loadBalancer\` (apiDomain, redirectDomains) — if domains are configured
     - \`scheduledJobs\` array — if cron jobs exist
4. For additional environments (staging, prod), add sibling keys with appropriate values
5. **Advise users:** Non-prod environments should typically use \`minInstances: 0\` (scale to zero) to save costs. Prod should have \`minInstances: 1\` or higher for availability.

## "Set up a new cloud environment (first deploy)"
The project already exists (created via \`tsdevstack init\`). This is for deploying to a new environment.
1. \`cloud_init --{provider}\` → checks local credentials + bootstraps the cloud project (enables APIs, creates roles, terraform state bucket)
2. Configure \`infrastructure.json\` with environment settings (see "Create infrastructure.json" workflow above)
3. \`cloud_secrets_push --env {env}\` → prompts for DOMAIN, RESEND_API_KEY, EMAIL_FROM; auto-generates framework secrets
4. \`infra_deploy --env {env}\` → the big deploy: Terraform infra (VPC, DB, Redis, storage buckets) + build Docker + push + deploy all services + Kong + LB. This does everything, including creating cloud storage buckets and syncing \`STORAGE_BUCKET_*\` secrets.
5. Set DNS records on domain registrar portal (from deploy output)
6. \`deploy_schedulers --env {env}\` (can run in parallel with DNS setup)
7. Check domain propagation: \`dig {domain}\` — wait for DNS to point to LB IP
8. \`list_deployed_services --env {env}\` → verify everything is running

**Step-by-step alternative:** If the user wants more control, they can run individual steps: \`infra_generate\` → \`infra_plan\` → review → \`infra_deploy\` → \`deploy_kong\` → \`deploy_lb\` → \`deploy_schedulers\`.

## "Deploy to a cloud environment (subsequent deploys)"
1. \`infra_plan --env {env}\` → preview infrastructure changes (always do this first)
2. Review the plan output
3. \`infra_deploy --env {env}\` → full deployment
4. \`list_deployed_services --env {env}\` → verify everything is running

## "Deploy code changes only (no infra changes)"
1. \`deploy_services --env {env}\` → build, push, deploy all services
2. Or for single service: \`deploy_services --env {env} --service {name}\`

## "Update Kong routes after API changes"
1. \`deploy_kong --env {env}\` → rebuild and deploy Kong with new routes

## "Check what's deployed"
1. \`list_deployed_services --env {env}\` → all services with status
2. \`get_service_status --service {name} --env {env}\` → specific service details (URL, image tag, health)

## "Debug a missing secret"
1. Read \`tsdevstack://secrets/map\` — is the secret assigned to the service?
2. Read \`tsdevstack://secrets/user\` — is the secret defined in \`.secrets.user.json\`?
3. If cloud: \`diff_secrets --env {env}\` → compare local vs cloud (shows what's missing or extra)

## "Debug a 404 on an API endpoint"
1. Read \`tsdevstack://kong/routes\` — does the route exist in Kong config?
2. If missing: check OpenAPI decorators on the controller method → \`generate_kong\`
3. If present in Kong but still 404: check the service's \`globalPrefix\` in config.json
4. If cloud: \`deploy_kong --env {env}\` to push updated routes

## "Add a scheduled job"
Scheduled jobs are cron triggers that call service endpoints over HTTPS. They don't execute code directly — they trigger an HTTP endpoint on an existing service. The service must be deployed before the scheduler can be deployed.
1. Create the endpoint in the target NestJS service:
   - Add a controller method (e.g., \`@Post('jobs/cleanup-tokens')\`)
   - Add \`@UseGuards(SchedulerGuard)\` from nest-common (validates requests come from the cloud scheduler)
   - Add OpenAPI decorators as usual
2. Deploy the service so the endpoint exists in cloud
3. Add the job to \`infrastructure.json\` under the environment's \`scheduledJobs\` array:
   \`\`\`json
   {
     "name": "cleanup-tokens",
     "schedule": "0 */4 * * *",
     "targetService": "auth-service",
     "endpoint": "/auth/jobs/cleanup-tokens",
     "method": "POST",
     "httpTimeout": 300
   }
   \`\`\`
4. \`deploy_schedulers --env {env}\` (or \`deploy_scheduler --env {env} --scheduler cleanup-tokens\`)

**Important:** Services must be deployed before schedulers. Schedulers only make HTTPS calls — they don't run code or access databases directly.

## "Change the database schema (Prisma)"
Prisma commands are run directly — no framework wrapper locally.
1. Edit \`apps/{service}/prisma/schema.prisma\`
2. Run \`cd apps/{service} && npx prisma migrate dev --name {migration-name}\` — creates migration + applies to local DB
3. Run \`cd apps/{service} && npx prisma generate\` — regenerates the Prisma client types
4. Restart the service to pick up the new schema
5. For cloud: \`plan_db_migrate --service {name} --env {env}\` → review → \`run_db_migrate --service {name} --env {env}\`

**Note:** \`npx prisma studio\` (from the service directory) opens a visual data browser at http://localhost:5555.

**Runtime:** nest-common provides \`createPrismaConnection()\` — a factory that creates a pg Pool + Prisma adapter with connection pooling. Services extend \`PrismaClient\` with this config. Don't create raw PrismaClient instances.

## "Run database migrations in cloud"
1. \`plan_db_migrate --service {name} --env {env}\` → preview pending migrations
2. Review the output
3. \`run_db_migrate --service {name} --env {env}\` → apply migrations

## "Add a new shared package"
Shared packages live in \`packages/\`. User preference: scaffold with rslib, select what's needed.
1. User creates the package in \`packages/{name}/\` (rslib scaffold or manual)
2. Add to workspace in root \`package.json\`
3. Other packages/apps import via \`@tsdevstack/{name}\`

## "Set up CI/CD"
1. \`infra_init_ci --github\` → generates \`.github/workflows/\` and \`.tsdevstack/ci.json\`
2. User adds GitHub secrets in repo Settings > Secrets and variables > Actions:
   - Secrets use **environment suffix** pattern (e.g., \`GCP_WIF_DEV\`, \`GCP_WIF_PROD\`)
   - **GCP:** \`GCP_WIF_{ENV}\`, \`GCP_SA_{ENV}\`, \`GCP_REGION_{ENV}\`
   - **AWS:** \`AWS_ROLE_ARN_{ENV}\`, \`AWS_REGION_{ENV}\`
   - **Azure:** \`AZURE_CLIENT_ID_{ENV}\`, \`AZURE_TENANT_ID_{ENV}\`, \`AZURE_SUBSCRIPTION_ID_{ENV}\`, \`AZURE_LOCATION_{ENV}\`
3. \`cloud_secrets_push --env {env}\` BEFORE first CI deploy (DOMAIN, RESEND_API_KEY, EMAIL_FROM + framework secrets)
4. Workflows are triggered by users on GitHub Actions UI — nice env/service selection available
5. PR workflow runs automatically on PRs against main (build, lint, tsc, test)
6. To add a new environment: update \`ci.json\` environments array → \`infra_generate_ci\` → add GitHub secrets → push cloud secrets → deploy

**CLI vs CI/CD:** Both can co-exist and either can manage everything independently. If a user wants CI-only deployments (no local CLI for cloud operations), they still need to set user secrets (DOMAIN, RESEND_API_KEY, EMAIL_FROM) manually via \`cloud_secrets_set\` with the correct naming — the CI workflow handles framework secrets but can't prompt for user values.

## "Start local development"
1. \`npm install\` (if fresh clone)
2. \`sync\` → generates all config: secrets, docker-compose, kong config, env files, secret-map
3. Tell user to run \`npm run dev\` — this starts Docker Compose (PostgreSQL, Redis, Kong, pgAdmin, Prometheus, Grafana, Jaeger, Redis Commander, and MinIO if storage buckets are configured) + all services in parallel via Lerna

### Local URLs
| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Next.js application |
| Kong Proxy | http://localhost:8000 | API gateway (all API calls go through here) |
| Kong Admin | http://localhost:8001 | Gateway management API |
| pgAdmin | http://localhost:5050 | Database management (login: admin@localhost.com / admin) |
| Redis Commander | http://localhost:8081 | Redis data browser |
| Prometheus | http://localhost:9090 | Metrics storage and queries |
| Grafana | http://localhost:4001 | Dashboards (login: admin / admin) |
| Jaeger | http://localhost:16686 | Distributed tracing UI |
| Prisma Studio | http://localhost:5555 | Visual database editor (run \`cd apps/{service} && npx prisma studio\`) |
| MinIO API | http://localhost:9000 | S3-compatible object storage (only if storage buckets configured) |
| MinIO Console | http://localhost:9001 | Storage browser (login: minioadmin / minioadmin) |

Backend services run on their configured ports (3001, 3002, 3003, etc.) — access them through Kong at \`:8000\` for authenticated requests, or directly for health/metrics.

### Email in local development
Locally, \`EMAIL_PROVIDER\` defaults to \`console\` — emails are logged to the terminal with sender, recipient, subject, and body. No real emails are sent.

**For the auth flow to work** (signup, password reset, email verification), watch the terminal output for the email log block containing the verification/reset link. Copy the link or token from there.

### Key things to know
- **Docker Compose is infrastructure**: PostgreSQL, Redis, Kong, monitoring — all started by \`npm run dev\`
- **Services run natively**: NestJS and Next.js run via \`nest start --watch\` / \`next dev\` (hot reload)
- **Secrets system**: Three-file merge (\`.secrets.tsdevstack.json\` + \`.secrets.user.json\` → \`.secrets.local.json\`). Edit \`.secrets.user.json\`, then \`generate_secrets\`
- **pgAdmin has pre-configured databases** — all service databases appear in the sidebar, no setup needed
- **Each service with a database** gets its own PostgreSQL container (separate ports: 5432, 5433, ...)

### Common issues
- **Port in use**: \`lsof -i :{port}\` to find the process
- **Kong 502**: Service not running — check \`docker compose ps\`, then \`sync\` + restart
- **Missing secrets**: Run \`generate_secrets\` to regenerate all config files

## "Add object storage to the project"
1. \`add_bucket_storage\` with a logical name (kebab-case, 2-30 chars) → updates config.json, regenerates docker-compose (adds MinIO if first bucket), regenerates secrets (adds STORAGE_* entries)
2. Tell user to restart Docker: \`docker compose up -d\` — MinIO starts on ports 9000 (API) + 9001 (console, login: minioadmin/minioadmin)
3. In the NestJS service that needs storage:
   - Import \`StorageModule.forRoot({ buckets: ['bucket-name'] })\` (or \`forRootAsync\` for dynamic config)
   - Inject with \`@InjectStorage('bucket-name') private storage: StorageProvider\`
   - Available methods: upload, download, downloadStream, delete, list, copy, getMetadata, getPresignedUrl, exists, getNativeClient
4. For cloud: \`infra_deploy --env {env}\` — Terraform creates the cloud bucket (S3/GCS/Azure Blob) and syncs \`STORAGE_BUCKET_*\` secrets to the cloud secret manager
5. The storage adapter is auto-selected at runtime based on \`SECRETS_PROVIDER\`: local/aws → S3, gcp → GCS, azure → Azure Blob. No code changes needed between local and cloud.

**Full reference:** See docs-site at \`/features/object-storage\` for API reference, bucket naming, secrets, and provider details.

## "Remove object storage from the project"
1. \`remove_bucket_storage\` with the bucket name → removes from config.json, regenerates docker-compose (removes MinIO if last bucket), regenerates secrets
2. Local MinIO data is NOT deleted — it remains in Docker volumes
3. For cloud cleanup: \`infra_deploy --env {env}\` removes the bucket from Terraform state. **WARNING: this deletes all data in the cloud bucket.** Back up first if needed.
4. If this was the last bucket: manually remove \`StorageModule\` imports from NestJS code
5. Cloud secrets (\`STORAGE_BUCKET_*\`) must be removed separately via \`cloud_secrets_remove\`

## "Add a custom secret to a service"
1. Edit \`.secrets.user.json\`:
   - Add key + value to \`"secrets"\` object (top level)
   - Add the key name to the target service's \`"secrets"\` array
2. \`generate_secrets\` → regenerates merged \`.secrets.local.json\`
3. Restart services (or they'll pick up on next restart)
4. For cloud: \`cloud_secrets_set KEY --value VALUE --env {env}\` then \`deploy_services --service {name}\` to restart with new secret

**Example** — adding STRIPE_KEY to offers-service:
\`\`\`json
{
  "secrets": {
    "STRIPE_SECRET_KEY": "sk_test_..."
  },
  "offers-service": {
    "secrets": ["STRIPE_SECRET_KEY"]
  }
}
\`\`\`

## "Remove a service"
1. \`remove_service\` for local removal (deletes files, updates config)
2. For cloud removal: \`remove_service_cloud --service {name} --env {env}\` (deletes container, secrets, database — PERMANENT)

## "Remove a detached worker"
1. \`unregister_detached_worker --worker {name}\` → removes from config.json
2. For cloud removal: \`remove_detached_worker --env {env} --worker {name}\` (deletes container — PERMANENT)`;

export function registerGuideWorkflowsResource(server: McpServer): void {
  server.resource(
    'guide-workflows',
    'tsdevstack://guide/workflows',
    {
      description:
        'Step-by-step workflow chains for common tasks: adding services, deploying, debugging secrets, setting up CI/CD, local development, and more.',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: WORKFLOWS_CONTENT,
          mimeType: 'text/markdown',
        },
      ],
    }),
  );
}
