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
1. \`register_detached_worker\` with name and base-service → adds worker entry to config.json, and creates whichever of these are missing (never overwriting one):
   - \`apps/{base-service}/src/worker.ts\`: entry point using \`startWorker()\` from nest-common
   - \`apps/{base-service}/src/worker.module.ts\`: NestJS module importing \`BullConfigModule.forRoot()\`, with no queues yet
   - \`apps/{base-service}/tsconfig.worker.json\`: extends \`tsconfig.build.json\` with \`"outDir": "./node_modules/.cache/worker-dev"\` (local build of the worker)
   - Scripts in \`apps/{base-service}/package.json\`: \`"start-worker": "node dist/worker.js"\` and \`"start-worker:dev": "nest start --entryFile worker --watch --path tsconfig.worker.json"\` (\`npm run dev\` starts it)
2. Write the processors: \`apps/{base-service}/src/processors/{queue-name}.processor.ts\` (BullMQ \`@Processor\` classes); in \`worker.module.ts\`, register each queue with \`BullModule.registerQueue({ name: 'queue-name' })\` and add the processor to \`providers\`
3. Import \`BullModule.registerQueue({ name: 'queue-name' })\` in the main app module too (so the app can add jobs to the queue). Processors go ONLY in the worker module, never in the app module
4. \`sync\` → regenerates config
5. \`infra_deploy --env {env}\` (Terraform must create the worker container)
6. After first deploy, code updates: \`deploy_services --service {base-service}\` (deploys both app and worker)

## "Add an API endpoint"
No CLI command needed; this is code:
1. Add method to NestJS controller
2. Add OpenAPI decorators: \`@ApiOperation({ summary: '...' })\`, \`@ApiResponse({ ... })\`
3. For authentication: add \`@ApiBearerAuth()\` (the backend \`AuthGuard\` is global, no \`@UseGuards\` needed). To restrict by role, add \`@Roles('ADMIN')\` (or a custom role).
4. For partner API access: add \`@PartnerApi()\` (can combine with \`@ApiBearerAuth()\` for dual access). Only this operation gets a partner route (\`/api\` + its path).
5. For public endpoints: add \`@Public()\` and no \`@ApiBearerAuth()\` (without \`@Public()\` the backend answers 401)
6. \`sync\` (or \`npm run docs:generate\` then \`generate_kong\`) → regenerates the OpenAPI spec and the gateway routes. Kong routes only exact paths and methods from the spec; until you regenerate, the new endpoint is 404 at the gateway.
7. \`generate_client\` → regenerates TypeScript client so other services have the new endpoint typed
8. For cloud: \`deploy_services\`, then \`infra_generate_kong\` → \`infra_build_kong\` → \`deploy_kong\` (commit the regenerated \`infrastructure/kong/{env}/kong.yml\`)

## "Add a secret to a service"
A backend service reads two scopes: shared (every service reads it) and its own. A secret only one service needs belongs in that service's scope; a value under the top-level \`"secrets"\` object is shared, readable by every backend.
1. Locally: the user adds the value to the service's section of \`.secrets.user.json\`: \`"offers-service": { "STRIPE_SECRET_KEY": "sk_test_..." }\`
2. \`generate_secrets\` → regenerates \`.secrets.local.json\`; backends pick the value up within a minute (SecretsService cache), no restart
3. Cloud: the user runs \`npx tsdevstack cloud-secrets:set {KEY} --service {name} --env {env}\` in their own terminal; it asks for the value. Don't ask for the value yourself. Until then \`cloud_secrets_push\` lists it as missing. Backends read it within 5 minutes, no redeploy
4. Only a value every service needs goes under the top-level \`"secrets"\` object (cloud: the same command without \`--service\`)

Frontends (Next.js, SPA) are different: at deploy they get the shared keys listed in their \`"secrets"\` array (\`tsdevstack://secrets/map\`) as environment variables, so a frontend secret is shared, is listed in that array, and needs \`deploy_services --service {name}\` after a change.

## "Assign a domain to a frontend app"
Only \`nextjs\` and \`spa\` apps can have domains. Backend services are NOT publicly available: they're behind Kong. Kong already has a fixed \`api.{DOMAIN}\` URL.
1. Ask the user first, then \`get_secret DOMAIN --env {env}\` → check if DOMAIN is set in cloud
2. If DOMAIN is not set: tell the user to run \`npx tsdevstack cloud-secrets:set DOMAIN example.com --env {env}\`, then \`npx tsdevstack cloud-secrets:push --env {env}\` in their own terminal (the push derives API_URL, APP_URL and KONG_CORS_ORIGINS)
3. If DOMAIN is set: edit \`infrastructure.json\` → add \`"domain": "example.com"\` to the frontend app's env entry
   - If the app doesn't have an entry in the env config yet, create one: \`"frontend": { "domain": "example.com" }\`
4. For redirect domains (alternate domains that redirect to canonical): add \`"loadBalancer": { "redirectDomains": ["alt.com"] }\` to the env config
5. \`deploy_lb --env {env}\` → deploys/updates load balancer, outputs DNS records and SSL validation info
6. User adds DNS records at their domain registrar (A/CNAME records from the output)
7. Check DNS propagation: \`dig {domain}\`; wait for it to point to the LB IP
8. SSL certificate auto-provisions after DNS propagates

## "Generate a typed HTTP client for service-to-service calls"
1. Ensure target service has proper OpenAPI decorators on all endpoints
2. \`generate_client\` for the target service → generates TypeScript client + DTOs in \`packages/{service}-client/\`
3. In the calling service, create a client class extending \`BaseServiceClient\` from nest-common
4. Inject \`SecretsService\` to get the target service URL and API key
5. The generated client provides full type safety for all endpoints, request bodies, and responses

## "Create infrastructure.json for a new environment"
This file is user-created: the framework does NOT generate it. Only create it if needed (e.g., to override defaults).
Most projects on GCP or Azure WILL need this because \`minInstances: 0\` (scale to zero) is a common non-prod setting that saves costs. AWS does not support scale to zero: \`minInstances: 0\` fails validation on AWS for services and Kong, so AWS environments use 1 or more.
1. Read \`tsdevstack://config\` to get the list of services
2. Read \`tsdevstack://infrastructure-schema\` to know valid fields and values (only available after \`infra_init\`)
3. Create \`.tsdevstack/infrastructure.json\` with:
   - \`"$schema": "./infrastructure.schema.json"\` (REQUIRED, enables IDE validation)
   - \`"version": "1.0.0"\`
   - Environment key (e.g., \`"dev"\`) containing:
     - Per-service overrides (CPU, memory, minInstances, maxInstances): service names must match config.json
     - \`database\` settings (tier, deletionProtection, etc.)
     - \`redis\` settings (tier, memoryGb)
     - \`kong\` settings (minInstances, maxInstances, cpu, memory)
     - \`accessControl\` (noIndex)
     - \`loadBalancer\` (apiDomain, redirectDomains), if domains are configured
     - \`scheduledJobs\` array, if cron jobs exist
4. For additional environments (staging, prod), add sibling keys with appropriate values
5. **Advise users:** On GCP and Azure, non-prod environments can use \`minInstances: 0\` (scale to zero) to save costs: messages for those services wait in Redis until a request starts them, and the first request waits for a cold start. On AWS every service and Kong needs \`minInstances: 1\` or more (no scale to zero); lower AWS dev cost with smaller \`cpu\`/\`memory\` instead. Prod should keep \`minInstances: 1\` or higher (the default) for every service. On GCP, a NestJS service with \`minInstances\` 1 or more keeps its CPU on between requests and needs \`cpu\` 1 or more.

## "Set up a new cloud environment (first deploy)"
The project already exists (created via \`tsdevstack init\`). This is for deploying to a new environment.
1. \`cloud_init --{provider}\` → checks local credentials + bootstraps the cloud project (enables APIs, creates roles, terraform state bucket)
2. Configure \`infrastructure.json\` with environment settings (see "Create infrastructure.json" workflow above)
3. Tell the user to run \`npx tsdevstack cloud-secrets:push --env {env}\` in their own terminal: it asks for DOMAIN first, then for every secret in \`.secrets.user.json\`, generates the framework secrets and derives API_URL, APP_URL and KONG_CORS_ORIGINS. Don't ask for the values and don't set them yourself; wait until the user says it's done
4. \`infra_deploy --env {env}\` → the big deploy: Terraform infra (VPC, DB, Redis, storage buckets) + build Docker + push + deploy all services + Kong + LB. This does everything, including creating cloud storage buckets and syncing \`STORAGE_BUCKET_*\` secrets.
5. Set DNS records on domain registrar portal (from deploy output)
6. \`deploy_schedulers --env {env}\` (can run in parallel with DNS setup)
7. Check domain propagation: \`dig {domain}\`; wait for DNS to point to LB IP
8. \`list_deployed_services --env {env}\` → verify everything is running

**Step-by-step alternative:** If the user wants more control, they can run individual steps: \`infra_generate\` → \`infra_plan\` → review → \`infra_deploy\` → \`deploy_schedulers\`. (\`infra_deploy\` already includes Kong and the load balancer; run \`infra_generate_kong\` → \`infra_build_kong\` → \`deploy_kong\` or \`deploy_lb\` separately only after later changes.)

**First admin (auth template):** the user sets \`ADMIN_EMAILS\` in the auth-service scope: the push asks for it when the local value is set, or \`npx tsdevstack cloud-secrets:set ADMIN_EMAILS --service auth-service --env {env}\` in their own terminal. A confirmed user listed there becomes ADMIN at their next login. Roles are then managed through the auth service's admin API (\`/auth/v1/admin/users\`).

## "Deploy to a cloud environment (subsequent deploys)"
1. \`infra_plan --env {env}\` → preview infrastructure changes (always do this first)
2. Review the plan output
3. \`infra_deploy --env {env}\` → full deployment
4. \`list_deployed_services --env {env}\` → verify everything is running

## "Upgrade an existing cloud environment to a newer CLI"
Secrets an older CLI kept in places the services no longer read from (the auth secrets in shared; on Azure, every service's secrets in the shared vault) move in three steps:
1. \`cloud_secrets_migrate --env {env}\` → copies them to their new places; never deletes or overwrites, safe to repeat. If it reports a different value, show the user and ask which value is right
2. \`infra_plan --env {env}\`, review, then \`infra_deploy --env {env}\` → the services now read the new places
3. Ask the user, then \`cloud_secrets_cleanup --env {env}\` → deletes the old copies whose new copy has the same value and lists the ones it kept. Never before the deploy: on Azure it refuses while a Container App still reads the old copies

If \`infra_plan\` or \`infra_deploy\` stops because the lock file holds older Terraform providers, the upgrade is the user's step. Show them the message. They run \`npx tsdevstack infra:plan --env {env} --upgrade\`, review the plan and commit \`.terraform.lock.hcl\`. Then continue with \`infra_deploy\`.

## "Deploy code changes only (no infra changes)"
1. \`deploy_services --env {env}\` → build, push, deploy all services
2. Or for single service: \`deploy_services --env {env} --service {name}\`

## "Update Kong routes after API changes"
1. \`infra_generate_kong --env {env}\` → regenerates \`infrastructure/kong/{env}/kong.yml\` from the OpenAPI specs and \`kong.user.yml\` (commit it)
2. \`infra_build_kong --env {env}\` → builds and pushes the Kong image (includes \`kong-plugins/\`)
3. \`deploy_kong --env {env}\` → deploys the built image (alone, it does not pick up new routes or plugins)

The same three steps apply after editing \`kong.user.yml\`, adding a plugin to \`kong-plugins/\`, or upgrading the CLI.

## "Add a custom Kong plugin"
1. User creates \`kong-plugins/{plugin-name}/handler.lua\` and \`schema.lua\` at the project root (folder name = plugin name: lowercase letters, digits, \`-\`, \`_\`; must not reuse a bundled, OIDC or tsdevstack plugin name)
2. Enable it in \`kong.user.yml\` (global, per service or per consumer)
3. \`sync\` → rebuilds the local gateway image with the plugin
4. For cloud: \`infra_generate_kong\` → \`infra_build_kong\` → \`deploy_kong\`
Never edit \`infrastructure/kong/Dockerfile\`: it's generated.

## "Check what's deployed"
1. \`list_deployed_services --env {env}\` → all services with status
2. \`get_service_status --service {name} --env {env}\` → specific service details (URL, image tag, health)

## "Debug an error in a deployed environment (read the logs)"
Logs can contain sensitive data. Ask the user before every \`get_logs\` call: which environment, which sources, and why. Wait for an explicit yes.
1. \`get_logs --env {env}\` → the sources (services, workers, frontends, kong, migrate-{service}, scheduled jobs, edge) and when each last logged
2. \`get_logs --env {env} --source {name} --level warn\` → the newest 200 warnings and errors of the last hour. \`kind: platform\` shows crashes, failed health checks and deploys; \`kind: edge\` the load balancer and WAF
3. Follow one request: take \`trace_id\` from a line, then \`get_logs --env {env} --all --grep {trace id}\`
4. The tool says which lines it left out: narrow with \`since\`, \`until\`, \`level\`, \`kind\` or \`grep\` to see them
Times are UTC. Azure lines arrive 1 to 10 minutes late. Logs hold personal data (emails, IP addresses, query strings): use them to debug, never copy them into files, issues or messages. On GCP, a missing Logs Viewer role means the user runs \`infra_bootstrap --env {env}\`; the read limit (60 per minute) means waiting a minute or narrowing the query.

## "Debug a missing secret"
1. Read \`tsdevstack://secrets/user\`: is the secret defined in \`.secrets.user.json\`, at the top level (shared) or in the service's section (its own scope)? A backend reads shared and its own scope only; a value in another service's section is not readable
2. Frontends: read \`tsdevstack://secrets/map\`: is the key in the frontend's \`secrets\` array?
3. If cloud: \`diff_secrets --env {env}\` → compare local vs cloud (shows what's missing or extra), and, after asking the user, \`get_secret\` with the service scope to check where the value is

## "Debug a 404 on an API endpoint"
1. Read \`tsdevstack://kong/routes\`: does the route exist in Kong config?
2. If missing: check OpenAPI decorators on the controller method (and that it isn't excluded from OpenAPI) → \`npm run docs:generate\` → \`generate_kong\`
3. If present in Kong but still 404: routes are exact. Check the method, trailing slash, extra path segments, and the service's \`globalPrefix\` in config.json. Partner (\`/api/...\`) routes exist only for \`@PartnerApi()\` operations.
4. If cloud: \`infra_generate_kong\` → \`infra_build_kong\` → \`deploy_kong\` to push updated routes

## "Issue an API key to a partner"
Keys are runtime data behind the auth service API; there is no MCP tool and nothing to regenerate.
1. The endpoint needs \`@PartnerApi()\` (see "Add an API endpoint"); partners call it at \`/api\` + its path with \`x-api-key\`
2. An admin (\`ADMIN_EMAILS\`, see "Set up a new cloud environment") calls \`POST /auth/v1/admin/api-keys\` with a JWT: \`{ name, consumer, limitPerMinute?, limitPerHour?, limitPerDay?, limitPerWeek?, limitPerMonth?, expiresAt? }\`. The response contains \`key\` once; hand it over securely
3. Change limits or expiry: \`PATCH /auth/v1/admin/api-keys/:id\` (\`null\` clears). Rotate: \`POST .../:id/rotate\` (\`graceHours\`, default 168). Revoke: \`POST .../:id/revoke\`. All effective on the next request
4. Every cloud environment needs the \`sync-api-key-usage\` scheduled job (see "Add a scheduled job"; \`infra:generate\` prints the entry)
Never add \`consumers\` to \`kong.user.yml\` or partner keys to secrets: static keys were removed. Gateway errors: 401 \`api_key_missing\`/\`invalid_api_key\`/\`api_key_revoked\`/\`api_key_expired\`, 429 \`rate_limit_exceeded\`/\`quota_exceeded\`, 503 \`index_unavailable\` (Redis lost the index: call the job or restart the auth service) / \`gateway_unavailable\` (Redis unreachable).

## "Add a scheduled job"
Two kinds, both entries in an environment's \`scheduledJobs\` in \`infrastructure.json\`:
- **Cron job** (\`"type": "cron"\`): code in a NestJS service that runs on its own schedule as its own task, then exits. Use it for reports, cleanups, imports, anything longer than a few minutes or heavy. Up to a day per run (almost 7 days on GCP).
- **Trigger** (an entry with an \`endpoint\`): the schedule calls an endpoint of the running service. Only for short work that must run inside the service's process. The call waits at most 30 min on GCP, about 15 on AWS, 4 on Azure.
Never add an in-process scheduler (@nestjs/schedule, node-cron) to a service.

### Cron job
1. \`register_cron --service {service} --name {name}\` (kebab-case, at most 40 characters). It creates \`src/cron/{name}.cron.ts\`, and with the service's first cron job \`src/cron.ts\`, \`src/cron.module.ts\`, \`tsconfig.cron.json\` and the \`cron\` script. It never overwrites.
2. Write the handler's \`run(signal)\` in \`src/cron/{name}.cron.ts\`: inject what it needs (PrismaService, ...) through the constructor; return = success, throw = failure; check \`signal.aborted\` between long steps.
3. Second or later cron job of the service: the output prints two lines; add them to \`src/cron.module.ts\` (the import, and the class in the \`handlers\` list). Forgetting it makes the run exit 2.
4. \`run_cron --name {name} --service {service}\` with the local stack running: exit 0 is success.
5. Add the printed entry to \`scheduledJobs\` of each environment that should run it:
   \`\`\`json
   {
     "name": "usage-report",
     "type": "cron",
     "schedule": "0 3 * * *",
     "targetService": "auth-service",
     "timeout": 600
   }
   \`\`\`
   Optional: \`cpu\`, \`memory\` (the migration job's values; default 1 vCPU and 2 GiB, on AWS as \`"1024"\` and \`"2048"\`), \`timezone\` (UTC only on Azure). \`timeout\` 1 to 86400 s (GCP 604740).
6. \`infra_generate --env {env}\` → \`infra_deploy --env {env}\` (schedules first, then the service with its cron jobs). Later code changes ship with \`deploy_services\`; schedule, \`timeout\`, \`cpu\` or \`memory\` changes with \`infra_generate\` → \`deploy_schedulers\`.
7. Check it in the cloud at once, don't wait for the schedule: \`infra_run_cron --job {name} --env {env}\`, then \`list_schedulers --env {env}\` (last run). The job's log: \`get_logs\` with source {name} (ask the user first).

### Trigger
1. Create the endpoint in the target NestJS service:
   - A controller method (e.g., \`@Post('jobs/cleanup-tokens')\`)
   - \`@Public()\` and \`@UseGuards(SchedulerGuard)\` from nest-common (the scheduler calls the service directly, not through Kong; \`SchedulerGuard\` checks the call comes from the cloud scheduler)
   - Keep it out of the gateway with \`@ApiExcludeController()\` / \`@ApiExcludeEndpoint()\` (as the auth service's jobs controller does)
2. \`run_cron --name {name}\` calls it locally.
3. Deploy the service so the endpoint exists in the cloud
4. Add the job to \`scheduledJobs\`:
   \`\`\`json
   {
     "name": "cleanup-tokens",
     "schedule": "0 */4 * * *",
     "targetService": "auth-service",
     "endpoint": "/auth/jobs/cleanup-tokens",
     "method": "POST",
     "httpTimeout": 120
   }
   \`\`\`
   \`httpTimeout\` (seconds) is 15 to 1800 on GCP, 15 to 890 on AWS, 15 to 240 on Azure.
5. \`infra_generate --env {env}\` → \`deploy_schedulers --env {env}\` (or \`deploy_scheduler --env {env} --job cleanup-tokens\`)
6. \`infra_run_cron --job {name} --env {env}\` to call it now.

Names are unique across both kinds. Removing a job: \`remove_scheduler\`, then take the entry out of \`infrastructure.json\`.

**Auth template:** every environment needs \`{"name":"sync-api-key-usage","schedule":"*/5 * * * *","targetService":"auth-service","endpoint":"/auth/jobs/sync-api-key-usage","method":"POST"}\` (API key usage totals and the Redis key index rebuild). \`infra_generate\` warns and prints the entry when it is missing.

## "Change the database schema (Prisma)"
Prisma commands are run directly; there is no framework wrapper locally.
1. Edit \`apps/{service}/prisma/schema.prisma\`
2. Run \`cd apps/{service} && npx prisma migrate dev --name {migration-name}\`: creates migration + applies to local DB
3. Run \`cd apps/{service} && npx prisma generate\`: regenerates the Prisma client types
4. Restart the service to pick up the new schema
5. For cloud: \`plan_db_migrate --service {name} --env {env}\` → review → \`run_db_migrate --service {name} --env {env}\`

**Note:** \`npx prisma studio\` (from the service directory) opens a visual data browser at http://localhost:5555.

**Runtime:** nest-common provides \`createPrismaConnection()\`: a factory that creates a pg Pool + Prisma adapter with connection pooling. Services extend \`PrismaClient\` with this config. Don't create raw PrismaClient instances.

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
3. BEFORE first CI deploy: the user runs \`npx tsdevstack cloud-secrets:push --env {env}\` in their own terminal (it asks for DOMAIN and every user secret)
4. Workflows are triggered by users on GitHub Actions UI; nice env/service selection available
5. PR workflow runs automatically on PRs against main (build, lint, tsc, test)
6. To add a new environment: update \`ci.json\` environments array → \`infra_generate_ci\` → add GitHub secrets → push cloud secrets → deploy

**CLI vs CI/CD:** Both can co-exist and either can manage everything independently. If a user wants CI-only deployments (no local CLI for cloud operations), they still set the user secrets once from their own terminal (\`npx tsdevstack cloud-secrets:push --env {env}\`); the CI workflow handles framework secrets but can't prompt for user values.

## "Start local development"
1. \`npm install\` (if fresh clone)
2. \`sync\` → generates all config: secrets, docker-compose, kong config, the Kong image build files, env files, secret-map (required on a fresh clone before \`docker compose up\`)
3. Tell user to run \`npm run dev\`: this starts Docker Compose (PostgreSQL, Redis, Kong, pgAdmin, Prometheus, Grafana, Jaeger, Redis Commander, and RustFS if storage buckets are configured) + all services and workers in parallel via Lerna

### Local URLs
| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Next.js application |
| Kong Proxy | http://localhost:8000 | API gateway (all API calls go through here) |
| Kong Admin | http://localhost:8001 | Gateway management API |
| pgAdmin | http://localhost:5050 | Database management (login: admin@localhost.com / admin) |
| Redis Commander | http://localhost:8081 | Redis data browser |
| Prometheus | http://localhost:9090 | Metrics storage and queries |
| Grafana | http://localhost:4001 | Dashboards in the \`tsdevstack\` folder (view without login; admin / admin to edit) |
| Jaeger | http://localhost:16686 | Distributed tracing UI |
| Prisma Studio | http://localhost:5555 | Visual database editor (run \`cd apps/{service} && npx prisma studio\`) |
| RustFS API | http://localhost:9000 | S3-compatible object storage (only if storage buckets configured) |
| RustFS Console | http://localhost:9001 | Storage browser (login: rustfsadmin / rustfsadmin) |

Backend services run on their configured ports (3001, 3002, 3003, etc.); access them through Kong at \`:8000\` for authenticated requests, or directly for health/metrics.

### Email in local development
Locally, \`EMAIL_PROVIDER\` defaults to \`console\`: emails are logged to the terminal with sender, recipient, subject, and body. No real emails are sent.

**For the auth flow to work** (signup, password reset, email verification), watch the terminal output for the email log block containing the verification/reset link. Copy the link or token from there.

### Key things to know
- **Docker Compose is infrastructure**: PostgreSQL, Redis, Kong, monitoring, all started by \`npm run dev\`
- **Services run natively**: NestJS and Next.js run via \`nest start --watch\` / \`next dev\` (hot reload)
- **Secrets system**: Three-file merge (\`.secrets.tsdevstack.json\` + \`.secrets.user.json\` → \`.secrets.local.json\`). Edit \`.secrets.user.json\`, then \`generate_secrets\`
- **pgAdmin has pre-configured databases**: all service databases appear in the sidebar, no setup needed
- **Each service with a database** gets its own PostgreSQL container (separate ports: 5432, 5433, ...)

### Common issues
- **Port in use**: \`lsof -i :{port}\` to find the process
- **Kong 502**: Service not running; check \`docker compose ps\`, then \`sync\` + restart
- **Kong fails to start after a CLI upgrade**: the config uses tsdevstack plugins (\`tsdevstack-strip-identity\`, \`tsdevstack-api-prefix\`) that the old gateway image doesn't have. \`sync\` (or \`docker compose up -d --build gateway\`) rebuilds it
- **401 calling a backend directly** (\`localhost:300x\`) with a user header: expected, backends only trust identity from Kong. Call through \`:8000\` with a JWT
- **First admin locally**: set \`ADMIN_EMAILS\` in \`.secrets.user.json\`, \`generate_secrets\`, restart the auth service, then log in with that confirmed email
- **Missing secrets**: Run \`generate_secrets\` to regenerate all config files

## "Add object storage to the project"
1. \`add_bucket_storage\` with a logical name (kebab-case, 2-30 chars) → updates config.json, regenerates docker-compose (adds RustFS if first bucket), regenerates secrets (adds STORAGE_* entries)
2. Tell user to restart Docker: \`docker compose up -d\`. RustFS starts on ports 9000 (API) + 9001 (console, login: rustfsadmin/rustfsadmin)
3. In the NestJS service that needs storage:
   - Import \`StorageModule.forRoot({ buckets: ['bucket-name'] })\` (or \`forRootAsync\` for dynamic config)
   - Inject with \`@InjectStorage('bucket-name') private storage: StorageProvider\`
   - Available methods: upload, download, downloadStream, delete, list, copy, getMetadata, getPresignedUrl, exists, getNativeClient
4. For cloud: \`infra_deploy --env {env}\`. Terraform creates the cloud bucket (S3/GCS/Azure Blob) and syncs \`STORAGE_BUCKET_*\` secrets to the cloud secret manager
5. The storage adapter is auto-selected at runtime based on \`SECRETS_PROVIDER\`: local/aws → S3, gcp → GCS, azure → Azure Blob. No code changes needed between local and cloud.

**Full reference:** See docs-site at \`/features/object-storage\` for API reference, bucket naming, secrets, and provider details.

## "Remove object storage from the project"
1. \`remove_bucket_storage\` with the bucket name → removes from config.json, regenerates docker-compose (removes RustFS if last bucket), regenerates secrets
2. Local RustFS data is NOT deleted; it remains in ./data/rustfs
3. For cloud cleanup: \`infra_deploy --env {env}\` removes the bucket from Terraform state. **WARNING: this deletes all data in the cloud bucket.** Back up first if needed.
4. If this was the last bucket: manually remove \`StorageModule\` imports from NestJS code
5. Cloud secrets (\`STORAGE_BUCKET_*\`) must be removed separately via \`cloud_secrets_remove\`

## "Add a custom secret to a service"
See "Add a secret to a service": the value goes in the service's section of \`.secrets.user.json\` (its own scope), and in the cloud the user runs \`npx tsdevstack cloud-secrets:set {KEY} --service {name} --env {env}\` in their own terminal.

**Example**: STRIPE_SECRET_KEY for offers-service only:
\`\`\`json
{
  "offers-service": {
    "STRIPE_SECRET_KEY": "sk_test_..."
  }
}
\`\`\`
Cloud: the user runs \`npx tsdevstack cloud-secrets:set STRIPE_SECRET_KEY --service offers-service --env {env}\`. Not under the top-level \`"secrets"\` object: every service could read it there.

## "Remove a service"
1. In each environment it ran in: \`remove_service_cloud --service {name} --env {env}\` (deletes its containers, workers, secrets and database; the database is saved first, kept 7 days)
2. \`remove_service\` for local removal (deletes files, updates config)
3. In each of those environments: \`infra_deploy --env {env}\` (removes its Kong and load balancer routes and the scheduled jobs that call it)

## "Bring back a removed service's database"
1. With the service in the project: \`cloud_secrets_push --env {env}\`, then \`infra_deploy --env {env}\`
2. \`restore_database --service {name} --env {env}\` (the newest file from the removal; the current contents are saved first, so it can be undone)
3. If its migrations are newer than the file: \`run_db_migrate --service {name} --env {env}\`

## "Remove a detached worker"
1. \`unregister_detached_worker --worker {name}\` → removes from config.json
2. For cloud removal: \`remove_detached_worker --env {env} --worker {name}\` (deletes container; this is permanent)`;

export function registerGuideWorkflowsResource(server: McpServer): void {
  server.registerResource(
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
