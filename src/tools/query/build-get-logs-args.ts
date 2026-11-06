/**
 * Build the infra:logs arguments for get_logs
 *
 * Without a source and without `all`, the command lists the sources. With
 * one, it returns the newest lines as JSON, without the provider's records
 * (they would crowd out the lines).
 */

import { GET_LOGS_NEWEST_LINES } from '../../constants/index.js';

export interface GetLogsInput {
  env: string;
  source?: string;
  all?: boolean;
  since?: string;
  until?: string;
  level?: string;
  kind?: string;
  grep?: string;
}

export function buildGetLogsArgs(input: GetLogsInput): string[] {
  const args = ['infra:logs'];
  if (input.source) {
    args.push(input.source);
  }
  args.push('--env', input.env, '--json');

  if (!input.source && !input.all) {
    return args;
  }

  if (input.all) {
    args.push('--all');
  }
  args.push('--newest', String(GET_LOGS_NEWEST_LINES), '--no-raw');
  if (input.since) {
    args.push('--since', input.since);
  }
  if (input.until) {
    args.push('--until', input.until);
  }
  if (input.level) {
    args.push('--level', input.level);
  }
  if (input.kind) {
    args.push('--kind', input.kind);
  }
  if (input.grep) {
    args.push('--grep', input.grep);
  }
  return args;
}
