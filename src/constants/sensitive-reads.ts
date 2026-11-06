/**
 * Tools that read sensitive data (get_logs, get_secret)
 *
 * MCP can't make a client ask the user before a tool runs: the client
 * decides. These texts ask the agent to, as plainly as possible. They lead
 * the tools' descriptions and the server's instructions.
 */

export const GET_LOGS_ASK_FIRST =
  'ALWAYS ASK THE USER FIRST, EVERY TIME. Logs can contain sensitive data: emails, IP addresses, URLs with query strings, request details. ' +
  'Before you call this tool, tell the user which environment and which sources you want to read and why, and wait for an explicit yes. ' +
  'A yes covers only the read you described; ask again for anything else. Never call this tool on your own initiative. ';

export const GET_SECRET_ASK_FIRST =
  'ALWAYS ASK THE USER FIRST, EVERY TIME. This tool returns a secret value in plain text (API keys, passwords, tokens). ' +
  'Before you call it, tell the user which key and environment and why, and wait for an explicit yes. ' +
  'A yes covers only that key. Never call this tool on your own initiative. ';

export const SERVER_INSTRUCTIONS =
  'Two tools read sensitive data: get_logs (the logs of a deployed environment: emails, IP addresses, URLs with query strings, request details) ' +
  'and get_secret (a secret value in plain text). ' +
  'ALWAYS ASK THE USER FOR PERMISSION BEFORE EVERY CALL to either one. Say which environment and which sources or key, and why, then wait for an explicit yes. ' +
  'A yes covers only what you described; ask again for anything else. ' +
  'Never call them on your own initiative, and never as an unstated part of a larger task the user approved. If the user says no, do not call them. ' +
  'Never copy what they return into files, commits, issues or messages unless the user asks you to.';

/**
 * What tsdevstack://secrets/user shows in place of each value: the agent
 * sees which keys are set where, never the values.
 */
export const HIDDEN_SECRET_VALUE = '[value hidden]';
