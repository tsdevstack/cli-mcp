import { withRslibConfig } from '@rstest/adapter-rslib';
import { defineConfig } from '@rstest/core';

export default defineConfig({
  extends: withRslibConfig(),
  // run-command.test.ts starts the real CLI (npx); under the pre-push hook
  // every package's tests run at the same time and startup gets slow
  testTimeout: 60_000,
});
