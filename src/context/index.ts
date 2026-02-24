/**
 * Context Module
 *
 * Receives context from cli-core via initContext().
 * Commands call getContext() to access utilities.
 */

import type { PluginContext } from '@tsdevstack/cli/plugin';

let context: PluginContext;

export function initContext(ctx: PluginContext): void {
  context = ctx;
}

export function getContext(): PluginContext {
  return context;
}

// Re-export wrapCommand for register-commands.ts
export function wrapCommand<T extends unknown[]>(
  fn: (...args: T) => Promise<void>,
): (...args: T) => Promise<void> {
  return context.wrapCommand(fn);
}
