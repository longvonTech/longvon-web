import { assertProductionEnv, missingProductionEnv } from './required-production-env';

describe('production environment', () => {
  const complete = {
    NODE_ENV: 'production',
    DATABASE_URL: 'ci-only-placeholder-database-url',
    REDIS_URL: 'ci-only-placeholder-redis-url',
    JWT_ACCESS_SECRET: 'ci-only-placeholder-access',
    JWT_REFRESH_SECRET: 'ci-only-placeholder-refresh',
    ADMIN_IMAGE_PASSWORD: 'ci-only-placeholder-admin',
  } as NodeJS.ProcessEnv;

  it('does not block development when production secrets are absent', () => {
    expect(() => assertProductionEnv({ NODE_ENV: 'development' })).not.toThrow();
    expect(() => assertProductionEnv({ NODE_ENV: 'test' })).not.toThrow();
  });

  it('refuses to start production when a required name is missing', () => {
    const env = { ...complete };
    delete env.JWT_REFRESH_SECRET;
    expect(missingProductionEnv(env)).toEqual(['JWT_REFRESH_SECRET']);
    expect(() => assertProductionEnv(env)).toThrow(/JWT_REFRESH_SECRET/);
    try {
      assertProductionEnv(env);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      expect(message).not.toMatch(/postgres(?:ql)?:\/\//);
      expect(message).not.toMatch(/sk-/);
    }
  });

  it('accepts a complete production environment', () => {
    expect(missingProductionEnv(complete)).toEqual([]);
    expect(() => assertProductionEnv(complete)).not.toThrow();
  });
});
