# @tsdevstack/cli-mcp

MCP (Model Context Protocol) server plugin for the tsdevstack CLI. Exposes 48 tools and 12 resources so AI agents like Claude can understand and assist you with the framework, the infrastructure, deployment flows and querying the project state.

## Features

- **48 MCP Tools** — 13 read-only queries + 35 actions covering the full tsdevstack CLI surface
- **12 MCP Resources** — project state, secrets context, Kong routes, and framework guides
- **Stdio Transport** — connects via stdin/stdout for IDE and agent integration
- **Zod Validation** — all tool inputs validated with schemas
- **MCP Annotations** — tools include `readOnlyHint`, `destructiveHint`, and `idempotentHint` metadata

## Installation

```bash
npm install @tsdevstack/cli-mcp
```

Requires `tsdevstack` as a peer dependency.

## Usage

### As a CLI plugin

The MCP server registers as a plugin with the tsdevstack CLI:

```typescript
import { initContext, registerMcpPlugin } from '@tsdevstack/cli-mcp';

// Initialize with CLI plugin context
initContext(pluginContext);

// Register the mcp:serve command
registerMcpPlugin(program);
```

### Starting the server

```bash
npx tsdevstack mcp:serve
```

This starts the MCP server over stdio transport, ready for AI agent connections.

### Claude Code integration

Add to your `.mcp.json`:

```json
{
  "mcpServers": {
    "tsdevstack": {
      "command": "npx",
      "args": ["tsdevstack", "mcp:serve"]
    }
  }
}
```

## Tools

### Query tools (read-only)

| Tool                        | Description                             |
| --------------------------- | --------------------------------------- |
| `list_services`             | List all services with types and ports  |
| `list_environments`         | List configured cloud environments      |
| `get_project_config`        | Full project configuration              |
| `get_infrastructure_config` | Per-environment infrastructure settings |
| `get_service_status`        | Cloud resource status for a service     |
| `list_deployed_services`    | All deployed services in an environment |
| `list_secrets`              | Secret names in cloud (not values)      |
| `diff_secrets`              | Compare local vs cloud secrets          |
| `get_secret`                | Get a single secret value               |
| `list_schedulers`           | Scheduled jobs and status               |
| `plan_db_migrate`           | Preview pending database migrations     |
| `infra_plan`                | Terraform plan preview                  |
| `infra_status`              | Infrastructure sync status              |

### Action tools — local

| Tool                         | Description                                  |
| ---------------------------- | -------------------------------------------- |
| `sync`                       | Regenerate all local config                  |
| `generate_secrets`           | Regenerate local secrets files               |
| `generate_kong`              | Regenerate Kong gateway config               |
| `generate_docker_compose`    | Regenerate docker-compose.yml                |
| `add_service`                | Add a new service (nestjs, nextjs, spa)      |
| `remove_service`             | Remove a service from the project            |
| `generate_client`            | Generate TypeScript HTTP client from OpenAPI |
| `register_detached_worker`   | Register a detached worker in config         |
| `unregister_detached_worker` | Remove a worker from config                  |

### Action tools — cloud

| Tool                     | Description                            |
| ------------------------ | -------------------------------------- |
| `cloud_secrets_push`     | Push secrets to cloud                  |
| `cloud_secrets_set`      | Set a single cloud secret              |
| `cloud_secrets_remove`   | Remove a cloud secret                  |
| `infra_deploy`           | Full infrastructure deployment         |
| `deploy_services`        | Deploy code changes to services        |
| `deploy_service`         | Build + push + deploy a single service |
| `deploy_kong`            | Rebuild and deploy Kong gateway        |
| `deploy_lb`              | Deploy/update load balancer            |
| `run_db_migrate`         | Apply pending database migrations      |
| `deploy_schedulers`      | Deploy all scheduled jobs              |
| `deploy_scheduler`       | Deploy a single scheduled job          |
| `remove_service_cloud`   | Remove a service from cloud            |
| `remove_detached_worker` | Remove a worker from cloud             |
| `infra_destroy`          | Destroy all cloud infrastructure       |

### Action tools — setup & CI

| Tool                    | Description                           |
| ----------------------- | ------------------------------------- |
| `cloud_init`            | Initialize cloud provider credentials |
| `infra_bootstrap`       | Bootstrap cloud project               |
| `infra_init`            | Initialize Terraform state            |
| `infra_generate`        | Generate Terraform files              |
| `infra_generate_docker` | Generate Dockerfiles                  |
| `infra_build_docker`    | Build Docker images                   |
| `infra_push_docker`     | Push Docker images to registry        |
| `infra_build_kong`      | Build Kong Docker image               |
| `infra_init_ci`         | Initialize CI/CD workflows            |
| `infra_generate_ci`     | Regenerate CI workflows               |
| `validate_service`      | Validate service structure            |
| `remove_scheduler`      | Remove a scheduled job from cloud     |

## Resources

| Resource          | Description                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Project state (8) | Services list, environments, config, infrastructure settings, deployed services, secrets, schedulers, migration status |
| Secrets context   | Local and cloud secret names with diff                                                                                 |
| Kong routes       | Current gateway routing configuration                                                                                  |
| Guides (4)        | Framework guide, workflow guide, nest-common guide, config guide                                                       |

## Architecture

The MCP server is a thin layer over the tsdevstack CLI:

- **Query tools** either read local config files directly or wrap `npx tsdevstack` commands
- **Action tools** delegate to `runCommand()` which spawns `npx tsdevstack <command>` as a child process
- **Resources** read project files and provide contextual documentation

## License

MIT
