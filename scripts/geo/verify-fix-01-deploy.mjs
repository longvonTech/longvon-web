#!/usr/bin/env node
/**
 * GEO-FIX-01 whitelist deploy verifier. Read-only. Fail closed.
 *
 *   node scripts/geo/verify-fix-01-deploy.mjs source
 *   node scripts/geo/verify-fix-01-deploy.mjs predeploy --target /root/mateyou
 *   node scripts/geo/verify-fix-01-deploy.mjs postdeploy --target /root/mateyou
 *   node scripts/geo/verify-fix-01-deploy.mjs protect --target /root/mateyou
 *
 * --target may be omitted in source mode (validates the package payload).
 * This script never writes, rsyncs, or contacts production by itself.
 */
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadJson,
  verifyPostdeploy,
  verifyPredeploy,
  verifyProtect,
  verifySource,
} from './lib/fix-01-deploy.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');
const pkgDir = join(repoRoot, 'docs/geo/packages/geo-fix-01');
const manifestPath = join(pkgDir, 'MANIFEST.json');
const denylistPath = join(pkgDir, 'DENYLIST.json');

function parseArgs(argv) {
  const args = { mode: null, target: null };
  const rest = argv.slice(2);
  if (rest.length === 0) {
    throw new Error('usage: verify-fix-01-deploy.mjs <source|predeploy|postdeploy|protect> [--target DIR]');
  }
  args.mode = rest[0];
  for (let i = 1; i < rest.length; i++) {
    if (rest[i] === '--target') {
      args.target = rest[++i];
    } else {
      throw new Error(`unknown argument: ${rest[i]}`);
    }
  }
  const allowed = new Set(['source', 'predeploy', 'postdeploy', 'protect']);
  if (!allowed.has(args.mode)) {
    throw new Error(`unknown mode ${args.mode}`);
  }
  if (args.mode !== 'source' && !args.target) {
    throw new Error(`${args.mode} requires --target <production-or-checkout-root>`);
  }
  return args;
}

function fail(failures) {
  for (const f of failures) console.error(`FAIL ${f}`);
  console.error(`\n${failures.length} failure(s). Closed.`);
  process.exit(1);
}

const args = parseArgs(process.argv);
const manifest = loadJson(manifestPath);
const denylist = loadJson(denylistPath);
let result = { failures: [], notes: [] };

if (args.mode === 'source') {
  result = verifySource({ repoRoot, manifest, denylist });
} else if (args.mode === 'predeploy') {
  result = verifyPredeploy({ target: args.target, manifest });
} else if (args.mode === 'postdeploy') {
  result = verifyPostdeploy({ target: args.target, manifest });
} else if (args.mode === 'protect') {
  result = verifyProtect({ target: args.target, manifest, denylist });
}

for (const note of result.notes) {
  console.log(`NOTE ${note}`);
}

if (result.failures.length) fail(result.failures);
console.log(`OK ${args.mode} (${manifest.package} ${manifest.isolated_commit.slice(0, 7)})`);
