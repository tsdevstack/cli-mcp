import { describe, it, expect } from '@rstest/core';
import { hideSecretValues } from './hide-secret-values';
import { HIDDEN_SECRET_VALUE } from '../constants/index.js';

describe('hideSecretValues', () => {
  describe('Standard use cases', () => {
    it('should list the keys of the top-level secrets object', () => {
      expect(
        hideSecretValues({
          secrets: { RESEND_API_KEY: 're_live_123', DOMAIN: 'example.com' },
        }),
      ).toEqual({ secrets: ['RESEND_API_KEY', 'DOMAIN'] });
    });

    it("should hide the values in a service's section", () => {
      expect(
        hideSecretValues({
          'offers-service': { STRIPE_API_KEY: 'sk_test_xxx' },
          'auth-service': { TWILIO_ACCOUNT_SID: 'ACxxx' },
        }),
      ).toEqual({
        'offers-service': { STRIPE_API_KEY: HIDDEN_SECRET_VALUE },
        'auth-service': { TWILIO_ACCOUNT_SID: HIDDEN_SECRET_VALUE },
      });
    });

    it("should keep a frontend's list of shared key names", () => {
      expect(
        hideSecretValues({
          frontend: { secrets: ['DOMAIN', 'APP_URL'] },
        }),
      ).toEqual({ frontend: { secrets: ['DOMAIN', 'APP_URL'] } });
    });
  });

  describe('Edge cases', () => {
    it('should keep the generated file notes', () => {
      const notes = { $comment: 'generated', $instructions: { a: 'b' } };
      expect(hideSecretValues(notes)).toEqual(notes);
    });

    it('should keep $schema', () => {
      expect(hideSecretValues({ $schema: './secrets.schema.json' })).toEqual({
        $schema: './secrets.schema.json',
      });
    });

    it('should hide a top-level value that is not a section', () => {
      expect(hideSecretValues({ STRAY_KEY: 'value' })).toEqual({
        STRAY_KEY: HIDDEN_SECRET_VALUE,
      });
    });

    it('should hide nested objects and numbers in a section', () => {
      expect(
        hideSecretValues({
          'auth-service': { NESTED: { a: 'b' }, PORT: 3000 },
        }),
      ).toEqual({
        'auth-service': {
          NESTED: HIDDEN_SECRET_VALUE,
          PORT: HIDDEN_SECRET_VALUE,
        },
      });
    });

    it('should never return a value it was given', () => {
      const output = JSON.stringify(
        hideSecretValues({
          secrets: { A: 'top-secret-1' },
          'offers-service': { B: 'top-secret-2' },
          C: 'top-secret-3',
        }),
      );
      expect(output).not.toContain('top-secret');
    });
  });
});
