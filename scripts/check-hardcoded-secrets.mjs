#!/usr/bin/env node
/**
 * Fail when tracked source contains likely hard-coded credentials.
 * Output is file path plus variable name only. Matched values are never printed.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const REQUIRED_ECOSYSTEM_ENV = [
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'ADMIN_IMAGE_PASSWORD',
  'WECOM_WEBHOOK_URL',
  'DASHSCOPE_API_KEY',
];

const SENSITIVE_ENV_WORD =
  /(?:PASSWORD|SECRET|API_KEY|APIKEY|ACCESS_KEY|PRIVATE_KEY|WEBHOOK(?:_URL)?|DATABASE_URL|REDIS_URL|CLIENT_SECRET)/;

function isSensitiveEnvName(name) {
  return /^[A-Z][A-Z0-9_]*$/.test(name) && SENSITIVE_ENV_WORD.test(name);
}

function isEnvReference(value) {
  return /^process\.env\.[A-Za-z0-9_]+,?$/.test(value.trim());
}

const FIXTURE_FILES = new Set([
  '.env.example',
  '.env.production.example',
  '.github/workflows/ci.yml',
  'docker-compose.yml',
]);

const SKIP_FILES = new Set(['package-lock.json', 'npm-shrinkwrap.json']);

function isFixture(file) {
  return FIXTURE_FILES.has(file) || file.endsWith('.spec.ts') || file.endsWith('.test.ts');
}

function isPlaceholder(value) {
  const trimmed = value.trim().replace(/^['"]|['"]$/g, '');
  if (!trimmed) return true;
  if (trimmed.includes('${')) return true;
  return /^(?:replace(?:-with|-me)?|change[-_]?me|your[-_]|todo\b|xxx+|example\b|placeholder|ci-only-placeholder|请替换|请填入)/i.test(
    trimmed,
  );
}

function isAllowedSecretMaterial(value, file) {
  if (isPlaceholder(value)) return true;
  if (isFixture(file) && value === 'mateyou_dev_password') return true;
  if (
    isFixture(file) &&
    /test-(?:key|secret|token|password)/i.test(value) &&
    value.length <= 80 &&
    !value.includes('sk-')
  ) {
    return true;
  }
  return false;
}

function embeddedSecretsAllowed(value, file) {
  const databaseUrl = value.match(/postgres(?:ql)?:\/\/(?:[^:\s'"]+):([^@\s'"]+)@/i);
  if (databaseUrl) return isAllowedSecretMaterial(databaseUrl[1], file);
  const redisUrl = value.match(/redis:\/\/:([^@\s'"]+)@/i);
  if (redisUrl) return isAllowedSecretMaterial(redisUrl[1], file);
  return false;
}

function isBenignSensitiveValue(value, file) {
  if (isAllowedSecretMaterial(value, file)) return true;
  if (embeddedSecretsAllowed(value, file)) return true;
  if (/^redis:\/\/localhost(?::\d+)?(?:\/\d*)?$/.test(value)) return true;
  if (/^https?:\/\/[^@\s]+$/.test(value) && !/[?&](?:key|token|secret)=/i.test(value)) return true;
  if (/^(?:15m|30d|12h|production|development|test)$/.test(value)) return true;
  return false;
}

function redactOutput(text) {
  return text
    .replace(/postgres(?:ql)?:\/\/\S+/gi, 'postgresql://[redacted]')
    .replace(/redis:\/\/\S+/gi, 'redis://[redacted]')
    .replace(/sk-[A-Za-z0-9._-]+/g, 'sk-[redacted]')
    .replace(/([?&]key=)[^&\s'"]+/gi, '$1[redacted]');
}

function assignments(line) {
  const found = [];
  const quoted = /([A-Za-z_][A-Za-z0-9_]*)\s*[:=]\s*(['"`])((?:\\.|(?!\2)[\s\S])*)\2/g;
  let match = quoted.exec(line);
  while (match) {
    found.push({ name: match[1], value: match[3] });
    match = quoted.exec(line);
  }
  const unquoted = line.match(
    /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*[:=]\s*([^'"#\s][^#\n]*)$/,
  );
  if (unquoted && !/[:=]\s*['"`]/.test(line)) {
    found.push({ name: unquoted[1], value: unquoted[2].trim() });
  }
  const fallback = line.match(
    /process\.env\.([A-Za-z0-9_]+)\s*(?:\?\?|\|\|)\s*(['"`])((?:\\.|(?!\2)[\s\S])*)\2/,
  );
  if (fallback) found.push({ name: fallback[1], value: fallback[3] });
  return found;
}

export function scanText(file, text) {
  const findings = [];
  const seen = new Set();
  function add(variable) {
    const key = `${file} variable=${variable}`;
    if (seen.has(key)) return;
    seen.add(key);
    findings.push({ file, variable });
  }

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('*')) continue;

    for (const assignment of assignments(line)) {
      if (!isSensitiveEnvName(assignment.name)) continue;
      if (isEnvReference(assignment.value)) continue;
      if (isBenignSensitiveValue(assignment.value, file)) continue;
      if (/^[A-Z0-9_]+$/.test(assignment.value) && isSensitiveEnvName(assignment.value)) continue;
      add(assignment.name);
    }

    if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(line)) add('PRIVATE_KEY');
    if (/sk-[A-Za-z0-9._-]{20,}/.test(line)) add('API_KEY');

    const databaseUrl = line.match(/postgres(?:ql)?:\/\/([^:\s'"]+):([^@\s'"]+)@/i);
    if (databaseUrl && !isAllowedSecretMaterial(databaseUrl[2], file)) add('DATABASE_URL');

    const redisUrl = line.match(/redis:\/\/:([^@\s'"]+)@/i);
    if (redisUrl && !isAllowedSecretMaterial(redisUrl[1], file)) add('REDIS_URL');

    if (/webhook\/send\?key=[0-9a-fA-F-]{8,}/.test(line)) add('WECOM_WEBHOOK_URL');
  }
  return findings;
}

function joinParts(parts) {
  return parts.join('');
}

function runSelfTest() {
  // Build sample values at runtime. The scanner reads this file as tracked
  // source, so the samples must not appear here as contiguous literals.
  const apiKey = joinParts(['s', 'k', '-']) + 'A'.repeat(24);
  const password = 'p'.repeat(16);
  const postgresScheme = joinParts(['post', 'gresql://']);
  const devPassword = joinParts(['mateyou', '_dev_', 'password']);
  const adminFallback = joinParts(['built', '-in-', 'admin-', 'password']);
  const databaseSample = `DATABASE_URL: '${postgresScheme}appuser:${password}@localhost:5432/db'\n`;
  const databaseHits = scanText('ecosystem.config.js', databaseSample);
  if (!databaseHits.some((hit) => hit.variable === 'DATABASE_URL')) {
    throw new Error('self-test missed a database credential assignment');
  }
  const keyHits = scanText('config.js', `DASHSCOPE_API_KEY: '${apiKey}'\n`);
  if (!keyHits.some((hit) => hit.variable === 'DASHSCOPE_API_KEY' || hit.variable === 'API_KEY')) {
    throw new Error('self-test missed an API key assignment');
  }
  const rendered = [...databaseHits, ...keyHits]
    .map((hit) => `${hit.file} variable=${hit.variable}`)
    .join('\n');
  if (rendered.includes(apiKey) || rendered.includes(password)) {
    throw new Error('self-test printed a credential value');
  }
  const example = scanText(
    '.env.example',
    `DATABASE_URL="${postgresScheme}mateyou:${devPassword}@localhost:5432/mateyou?schema=public"\n`,
  );
  if (example.length > 0) throw new Error('self-test flagged the documented dev example');
  const placeholder = scanText('ecosystem.config.js', 'JWT_ACCESS_SECRET=请替换为随机字符串\n');
  if (placeholder.length > 0) throw new Error('self-test flagged a placeholder');
  const fallback = scanText(
    'apps/api/src/common/admin-auth.util.ts',
    `const password = process.env.ADMIN_IMAGE_PASSWORD ?? '${adminFallback}';\n`,
  );
  if (!fallback.some((hit) => hit.variable === 'ADMIN_IMAGE_PASSWORD')) {
    throw new Error('self-test missed an admin password fallback');
  }
  const outsideExample = scanText(
    'ecosystem.config.js',
    `DATABASE_URL=${postgresScheme}mateyou:${devPassword}@localhost/db\n`,
  );
  if (outsideExample.length === 0) {
    throw new Error('self-test allowed a database password outside example files');
  }
  const reference = scanText(
    'ecosystem.config.js',
    'DATABASE_URL: process.env.DATABASE_URL,\nJWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,\n',
  );
  if (reference.length > 0) throw new Error('self-test flagged an environment reference');
  const localName = scanText('auth.ts', 'const secret = process.env.JWT_ACCESS_SECRET;\n');
  if (localName.length > 0) throw new Error('self-test flagged a local secret variable');
  const ownSource = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
  const ownHits = scanText('scripts/check-hardcoded-secrets.mjs', ownSource);
  if (ownHits.length > 0) {
    const names = ownHits.map((hit) => hit.variable).join(', ');
    throw new Error(`self-test source was flagged: ${names}`);
  }
}

function trackedFiles() {
  const output = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' });
  return output.split('\0').filter(Boolean);
}

function scanWorkingTree() {
  const findings = [];
  for (const file of trackedFiles()) {
    if (SKIP_FILES.has(path.basename(file))) continue;
    if (/\.(png|jpe?g|gif|webp|ico|woff2?|pdf|zip|gz)$/i.test(file)) continue;
    const absolute = path.join(root, file);
    const stat = fs.statSync(absolute);
    if (!stat.isFile() || stat.size > 1_000_000) continue;
    const text = fs.readFileSync(absolute, 'utf8');
    if (text.includes('\0')) continue;
    findings.push(...scanText(file, text));
  }
  return findings;
}

function checkEcosystem() {
  const envBase = {
    PATH: process.env.PATH || '',
    HOME: process.env.HOME || '',
    NODE_ENV: 'production',
  };
  const failed = spawnSync(process.execPath, ['-e', "require('./ecosystem.config.js')"], {
    cwd: root,
    env: envBase,
    encoding: 'utf8',
  });
  const failedOutput = redactOutput(`${failed.stdout || ''}\n${failed.stderr || ''}`);
  if (failed.status === 0 || !failedOutput.includes('DATABASE_URL')) {
    console.error('ecosystem.config.js did not fail closed when required variables were absent');
    console.error(failedOutput.slice(0, 400));
    return false;
  }
  const ready = { ...envBase };
  for (const name of REQUIRED_ECOSYSTEM_ENV) {
    ready[name] = `ci-only-placeholder-${name.toLowerCase()}`;
  }
  const ok = spawnSync(
    process.execPath,
    [
      '-e',
      "const config = require('./ecosystem.config.js'); if (!config.apps || config.apps.length < 2) process.exit(2);",
    ],
    { cwd: root, env: ready, encoding: 'utf8' },
  );
  if (ok.status !== 0) {
    console.error('ecosystem.config.js rejected a complete placeholder environment');
    console.error(redactOutput(`${ok.stdout || ''}\n${ok.stderr || ''}`).slice(0, 400));
    return false;
  }
  return true;
}

function main() {
  try {
    runSelfTest();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'self-test failed';
    console.error(redactOutput(message));
    process.exit(1);
  }

  const findings = scanWorkingTree();
  const ecosystemOk = checkEcosystem();
  if (findings.length > 0 || !ecosystemOk) {
    console.error('Hard-coded credential check failed.');
    for (const finding of findings) {
      console.error(`${finding.file} variable=${finding.variable}`);
    }
    console.error('Report lists file and variable name only.');
    process.exit(1);
  }
  console.log('Hard-coded credential check passed.');
  console.log('ecosystem.config.js fail-closed check passed.');
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) main();
