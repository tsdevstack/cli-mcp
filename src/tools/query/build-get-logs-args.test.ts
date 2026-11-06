import { describe, it, expect } from '@rstest/core';
import { buildGetLogsArgs } from './build-get-logs-args';

describe('buildGetLogsArgs', () => {
  describe('Standard use cases', () => {
    it('should list the sources without a source or all', () => {
      expect(buildGetLogsArgs({ env: 'dev' })).toEqual([
        'infra:logs',
        '--env',
        'dev',
        '--json',
      ]);
    });

    it('should read the newest 200 lines of one source', () => {
      expect(buildGetLogsArgs({ env: 'dev', source: 'auth-service' })).toEqual([
        'infra:logs',
        'auth-service',
        '--env',
        'dev',
        '--json',
        '--newest',
        '200',
        '--no-raw',
      ]);
    });

    it('should read every source with the filters', () => {
      expect(
        buildGetLogsArgs({
          env: 'prod',
          all: true,
          since: '2h',
          until: '1h',
          level: 'error',
          kind: 'app',
          grep: 'req-123',
        }),
      ).toEqual([
        'infra:logs',
        '--env',
        'prod',
        '--json',
        '--all',
        '--newest',
        '200',
        '--no-raw',
        '--since',
        '2h',
        '--until',
        '1h',
        '--level',
        'error',
        '--kind',
        'app',
        '--grep',
        'req-123',
      ]);
    });
  });

  describe('Edge cases', () => {
    it('should ignore filters when only listing the sources', () => {
      expect(buildGetLogsArgs({ env: 'dev', level: 'warn' })).toEqual([
        'infra:logs',
        '--env',
        'dev',
        '--json',
      ]);
    });
  });
});
