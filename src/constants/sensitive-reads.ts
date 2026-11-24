/**
 * Tools that read sensitive data (get_logs, get_secret), and secret values
 *
 * MCP can't make a client ask the user before a tool runs: the client
 * decides. These texts ask the agent to, as plainly as possible. They lead
 * the tools' descriptions and the server's instructions.
 *
 * Secret values are the user's to set, in their own terminal: the agent
 * gives the command and never asks for a value.
 */

export const GET_LOGS_ASK_FIRST =
  'ALWAYS ASK THE USER FIRST, EVERY TIME. Logs can contain sensitive data: emails, IP addresses, URLs with query strings, request details. ' +
  'Before you call this tool, tell the user which environment and which sources you want to read and why, and wait for an explicit yes. ' +
  'A yes covers only the read you described; ask again for anything else. Never call this tool on your own initiative. ';

export const GET_SECRET_ASK_FIRST =
  'ALWAYS ASK THE USER FIRST, EVERY TIME. This tool returns a secret value in plain text (API keys, passwords, tokens). ' +
  'Before you call it, tell the user which key and environment and why, and wait for an explicit yes. ' +
  'A yes covers only that key. Never call this tool on your own initiative. ';

export const SECRET_VALUES_USER_SETS =
  'THE USER SETS SECRET VALUES, IN THEIR OWN TERMINAL. Never ask the user for a secret value, and never make one up. ' +
  'For the first setup of an environment, tell the user to run `npx tsdevstack cloud-secrets:push --env {env}`: it asks for DOMAIN and every secret in .secrets.user.json, and generates the framework secrets. ' +
  "For one key, tell them to run `npx tsdevstack cloud-secrets:set {KEY} --env {env}` (with `--service {name}` for a service's scope): it asks for the value. ";

export const SERVER_INSTRUCTIONS =
  'Two tools read sensitive data: get_logs (the logs of a deployed environment: emails, IP addresses, URLs with query strings, request details) ' +
  'and get_secret (a secret value in plain text). ' +
  'ALWAYS ASK THE USER FOR PERMISSION BEFORE EVERY CALL to either one. Say which environment and which sources or key, and why, then wait for an explicit yes. ' +
  'A yes covers only what you described; ask again for anything else. ' +
  'Never call them on your own initiative, and never as an unstated part of a larger task the user approved. If the user says no, do not call them. ' +
  'Never copy what they return into files, commits, issues or messages unless the user asks you to. ' +
  "Secret values are the user's to set, in their own terminal: give them the command (`npx tsdevstack cloud-secrets:push --env {env}` for a new environment, `npx tsdevstack cloud-secrets:set {KEY} --env {env}` for one key) and never ask for a value. " +
  'Call cloud_secrets_set only with a value the user gave you on their own.';

/**
 * What tsdevstack://secrets/user shows in place of each value: the agent
 * sees which keys are set where, never the values.
 */
export const HIDDEN_SECRET_VALUE = '[value hidden]';
