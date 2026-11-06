/**
 * get_logs constants
 */

/**
 * Lines get_logs returns: the newest of the window. MCP clients cut large
 * results without saying so; the CLI says what it left out instead.
 */
export const GET_LOGS_NEWEST_LINES = 200;

export const LOG_LEVEL_VALUES = [
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
] as const;

export const LOG_KIND_VALUES = ['app', 'platform', 'edge'] as const;
