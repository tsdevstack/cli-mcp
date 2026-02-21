import { describe, it, expect } from '@rstest/core';
import { runCommand } from './run-command';

describe('runCommand', () => {
  describe('Successful commands', () => {
    it('should return content array with text type on success', async () => {
      // Run a simple command that always succeeds (node --version)
      const result = await runCommand(['--version']);

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(typeof (result.content[0] as { text: string }).text).toBe(
        'string',
      );
    });

    it('should set isError to false on success', async () => {
      const result = await runCommand(['--version']);

      // --version exits with 0
      expect(result.isError).toBe(false);
    });
  });

  describe('Failed commands', () => {
    it('should set isError to true on non-existent command', async () => {
      const result = await runCommand([
        'nonexistent-command-that-does-not-exist',
      ]);

      expect(result.isError).toBe(true);
    });

    it('should include error output in content', async () => {
      const result = await runCommand([
        'nonexistent-command-that-does-not-exist',
      ]);

      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      // Error output should contain something (not empty)
      expect(
        (result.content[0] as { text: string }).text.length,
      ).toBeGreaterThan(0);
    });
  });

  describe('Output format', () => {
    it('should always return CallToolResult shape', async () => {
      const result = await runCommand(['--help']);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('isError');
      expect(Array.isArray(result.content)).toBe(true);
    });
  });
});
