/**
 * How much of a CLI command's output an MCP tool returns
 */

/**
 * At most this many characters (about 10,000 tokens; Claude Code refuses a
 * tool result over 25,000 by default). An agent reads a tool result in one go, and
 * a Terraform run prints far more (an AWS destroy: about 600,000).
 */
export const COMMAND_OUTPUT_MAX_CHARS = 40_000;

/**
 * Of those, how many come from the start of the output. The rest come from
 * its end, where the result and any error are.
 */
export const COMMAND_OUTPUT_HEAD_CHARS = 8_000;

/**
 * Terraform's progress lines ("Still destroying... [", "Refreshing state...",
 * "Reading...", "Read complete after"): one per resource, or every 10 seconds
 * per resource, and nothing the result doesn't say
 */
export const TERRAFORM_PROGRESS_LINE =
  /^\S.*: (Still [a-z]+\.\.\. \[|Refreshing state\.\.\.|Reading\.\.\.$|Read complete after )/;
