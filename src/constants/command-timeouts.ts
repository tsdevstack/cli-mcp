/**
 * Timeouts for the CLI commands the MCP tools run
 */

/**
 * Generators, queries and secret commands
 */
export const DEFAULT_COMMAND_TIMEOUT_MS = 10 * 60 * 1000;

/**
 * Commands that build images, run Terraform or cloud jobs, or deploy. A first
 * infra:deploy takes about 45 minutes on Azure, and capacity retries can add
 * 15 more. Ending the command early would stop Terraform in the middle of an
 * apply and leave the state locked.
 */
export const LONG_COMMAND_TIMEOUT_MS = 90 * 60 * 1000;
