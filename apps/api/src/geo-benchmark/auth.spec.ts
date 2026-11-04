import { UnauthorizedException } from '@nestjs/common';
import { verifyAdminToken } from '../common/admin-auth.util';

describe('geo benchmark authorization', () => {
  const original = process.env.ADMIN_IMAGE_PASSWORD;

  afterEach(() => {
    if (original === undefined) delete process.env.ADMIN_IMAGE_PASSWORD;
    else process.env.ADMIN_IMAGE_PASSWORD = original;
  });

  it('rejects a missing or wrong admin token', () => {
    process.env.ADMIN_IMAGE_PASSWORD = 'geo-admin-test-secret';
    expect(() => verifyAdminToken(undefined)).toThrow(UnauthorizedException);
    expect(() => verifyAdminToken('wrong-token')).toThrow(UnauthorizedException);
  });

  it('accepts the configured admin token', () => {
    process.env.ADMIN_IMAGE_PASSWORD = 'geo-admin-test-secret';
    expect(() => verifyAdminToken('geo-admin-test-secret')).not.toThrow();
  });
});
