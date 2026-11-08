#!/usr/bin/env node
/**
 * GEO-FIX-01 manifest-driven whitelist copy.
 *
 * Default is dry-run (no writes). Writes require BOTH:
 *   --execute --i-understand-this-writes-files
 *
 * Never rsyncs a tree. Copies only files with copy_to_production=true.
 * Applies DELETE entries as file unlinks under the confined target.
 */
import { existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  executePlan,
  loadJson,
  planWhitelistDeploy,
} from './lib/fix-01-deploy.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = resolve(here, '../..');

function parseArgs(argv) {
  const args = {
    target: null,
    repo: defaultRepoRoot,
    dryRun: true,
    execute: false,
    understand: false,
    sawDry: false,
    sawExecute: false,
  };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--target') args.target = rest[++i];
    else if (a === '--repo') args.repo = rest[++i];
    else if (a === '--dry-run') {
      args.sawDry = true;
      args.dryRun = true;
    } else if (a === '--execute') {
      args.sawExecute = true;
      args.execute = true;
    } else if (a === '--i-understand-this-writes-files') args.understand = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  if (!args.target || !String(args.target).trim()) {
    throw new Error(
      'usage: copy-fix-01-whitelist.mjs --target DIR [--dry-run | --execute --i-understand-this-writes-files]',
    );
  }
  if (args.sawDry && args.sawExecute) {
    throw new Error('refusing: pass either --dry-run or --execute, not both');
  }
  if (args.execute && args.understand) {
    args.dryRun = false;
  } else if (args.execute && !args.understand) {
    throw new Error('refusing to write: --execute requires --i-understand-this-writes-files');
  }
  return args;
}

const args = parseArgs(process.argv);
const repoRoot = resolve(args.repo);
const pkgDir = join(repoRoot, 'docs/geo/packages/geo-fix-01');
const manifest = loadJson(join(pkgDir, 'MANIFEST.json'));
const denylist = loadJson(join(pkgDir, 'DENYLIST.json'));
const target = resolve(args.target);

if (!existsSync(target) || !statSync(target).isDirectory()) {
  console.error(`FAIL target is not a directory: ${target}`);
  process.exit(1);
}

let plan;
try {
  plan = planWhitelistDeploy({ repoRoot, manifest, denylist, target });
} catch (err) {
  console.error(`FAIL ${err.message}`);
  process.exit(1);
}

const mode = args.dryRun ? 'DRY-RUN' : 'WRITE';
console.log(`${mode} target ${plan.targetRoot}`);
console.log(`${mode} COPY ${plan.copyCount} files, DELETE ${plan.deleteCount} files`);
for (const op of plan.ops) {
  if (op.op === 'copy') {
    console.log(`${mode} COPY ${op.action} ${op.source_path} -> ${op.dest}`);
  } else {
    console.log(`${mode} DELETE ${op.source_path} -> ${op.dest}`);
  }
}

if (args.dryRun) {
  console.log(`OK dry-run (${manifest.package} ${manifest.isolated_commit.slice(0, 7)})`);
  process.exit(0);
}

try {
  const result = executePlan(plan, { write: true });
  console.log(
    `OK execute copied=${result.copied} deleted=${result.deleted} (${manifest.package} ${manifest.isolated_commit.slice(0, 7)})`,
  );
} catch (err) {
  console.error(`FAIL ${err.message}`);
  process.exit(1);
}
