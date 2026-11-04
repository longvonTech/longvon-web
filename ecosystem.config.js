'use strict';

/**
 * Production PM2 process file.
 *
 * Secret values are read from the process environment only. Put them in the
 * server-side .env.production file (gitignored, excluded from deploy rsync)
 * or inject them from the server environment before `pm2 start` / `pm2 restart`.
 * This file must not contain secret literals. Loading it without the required
 * names throws, so PM2 will not start a production process with empty secrets.
 */

const REQUIRED_PRODUCTION_ENV = [
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'ADMIN_IMAGE_PASSWORD',
  'WECOM_WEBHOOK_URL',
  'DASHSCOPE_API_KEY',
];

const missing = REQUIRED_PRODUCTION_ENV.filter((name) => {
  const value = process.env[name];
  return typeof value !== 'string' || value.trim() === '';
});

if (missing.length > 0) {
  throw new Error(
    `[ecosystem.config.js] Missing required production environment variables: ${missing.join(', ')}. ` +
      'Set them in the server environment (for example .env.production, which is not committed) before starting PM2. ' +
      'Refusing to start.',
  );
}

function optionalEnv(name, fallback) {
  const value = process.env[name];
  if (typeof value !== 'string' || value.trim() === '') return fallback;
  return value;
}

const apiEnv = {
  NODE_ENV: 'production',
  API_PORT: 4000,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: optionalEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
  JWT_REFRESH_EXPIRES_IN: optionalEnv('JWT_REFRESH_EXPIRES_IN', '30d'),
  ADMIN_IMAGE_PASSWORD: process.env.ADMIN_IMAGE_PASSWORD,
  IMAGES_BASE_DIR: optionalEnv('IMAGES_BASE_DIR', '/var/www/mateyou'),
  WECOM_WEBHOOK_URL: process.env.WECOM_WEBHOOK_URL,
  DASHSCOPE_API_KEY: process.env.DASHSCOPE_API_KEY,
  GEMINI_MODEL: optionalEnv('GEMINI_MODEL', 'gemini-3.8-flash'),
};

const geminiApiKey = optionalEnv('GEMINI_API_KEY', '');
if (geminiApiKey) apiEnv.GEMINI_API_KEY = geminiApiKey;

module.exports = {
  apps: [
    {
      name: 'mateyou-api',
      script: '/root/mateyou/apps/api/dist/main.js',
      env: apiEnv,
    },
    {
      name: 'mateyou-web',
      script: '/root/mateyou/apps/web/.next/standalone/apps/web/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_SITE_URL: optionalEnv('NEXT_PUBLIC_SITE_URL', 'https://www.longvon.com'),
        WECOM_WEBHOOK_URL: process.env.WECOM_WEBHOOK_URL,
        NEXT_PUBLIC_BAIDU_VERIFICATION: optionalEnv('NEXT_PUBLIC_BAIDU_VERIFICATION', ''),
        NEXT_PUBLIC_API_BASE_URL: optionalEnv(
          'NEXT_PUBLIC_API_BASE_URL',
          'https://www.longvon.com/api',
        ),
      },
    },
  ],
};
