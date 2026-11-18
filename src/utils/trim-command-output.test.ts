import { describe, it, expect } from '@rstest/core';
import { trimCommandOutput } from './trim-command-output';
import {
  COMMAND_OUTPUT_HEAD_CHARS,
  COMMAND_OUTPUT_MAX_CHARS,
} from '../constants/index.js';

describe('trimCommandOutput', () => {
  describe('Standard use cases', () => {
    it('should keep a short output as it is', () => {
      expect(trimCommandOutput('Deploying...\nDone.')).toBe(
        'Deploying...\nDone.',
      );
    });

    it('should remove terminal color and cursor codes', () => {
      expect(
        trimCommandOutput(
          '\u001b[1m\u001b[33mWarning: \u001b[0mdeprecated\n\u001b[?25lSelect',
        ),
      ).toBe('Warning: deprecated\nSelect');
    });

    it("should leave out Terraform's progress lines, and keep the rest", () => {
      const output = [
        'aws_ecr_repository.db_init: Refreshing state... [id=shop/db-init]',
        'data.aws_caller_identity.current: Reading...',
        'data.aws_caller_identity.current: Read complete after 0s [id=1]',
        'aws_subnet.private[1]: Still destroying... [id=subnet-1, 14m00s elapsed]',
        'aws_ecr_lifecycle_policy.cleanup["auth-service"]: Still creating... [10s elapsed]',
        'aws_subnet.private[1]: Destruction complete after 14m26s',
        'Error: Invalid index',
        'Destroy complete! Resources: 199 destroyed.',
      ].join('\n');

      expect(trimCommandOutput(output)).toBe(
        [
          'aws_subnet.private[1]: Destruction complete after 14m26s',
          'Error: Invalid index',
          'Destroy complete! Resources: 199 destroyed.',
        ].join('\n'),
      );
    });
  });

  describe('Long output', () => {
    const lines = Array.from(
      { length: 5000 },
      (_, i) => `line ${String(i).padStart(4, '0')} ${'x'.repeat(40)}`,
    );
    const result = trimCommandOutput(lines.join('\n'));

    it('should keep the start and the end, within the limit', () => {
      expect(result.length).toBeLessThanOrEqual(COMMAND_OUTPUT_MAX_CHARS + 100);
      expect(result.startsWith(lines[0])).toBe(true);
      expect(result.endsWith(lines[4999])).toBe(true);
      expect(result.indexOf('\n[')).toBeLessThanOrEqual(
        COMMAND_OUTPUT_HEAD_CHARS,
      );
    });

    it('should keep whole lines, and say how many were left out', () => {
      const kept = result
        .split('\n')
        .filter((line) => line.startsWith('line '));
      expect(kept.every((line) => lines.includes(line))).toBe(true);
      const note = result.match(/\[(\d+) lines left out\./);
      expect(note).not.toBeNull();
      expect(kept.length + Number(note?.[1])).toBe(5000);
    });
  });
});
