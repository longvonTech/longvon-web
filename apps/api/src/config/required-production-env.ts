export const REQUIRED_PRODUCTION_ENV = [
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'ADMIN_IMAGE_PASSWORD',
] as const;

export function missingProductionEnv(env: NodeJS.ProcessEnv = process.env): string[] {
  return REQUIRED_PRODUCTION_ENV.filter((name) => !env[name]?.trim());
}

export function assertProductionEnv(env: NodeJS.ProcessEnv = process.env): void {
  if (env.NODE_ENV !== 'production') return;
  const missing = missingProductionEnv(env);
  if (missing.length === 0) return;
  throw new Error(
    `Missing required production environment variables: ${missing.join(', ')}. Refusing to start.`,
  );
}
