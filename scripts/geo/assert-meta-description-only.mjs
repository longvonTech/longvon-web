#!/usr/bin/env node
/**
 * Field-level guard: Meta Description-only edits vs a git base commit.
 * Fails if body/other metadata/import/form markers change beyond the allowlist.
 *
 *   node scripts/geo/assert-meta-description-only.mjs [--base COMMIT] [--repo DIR]
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const defaultRepo = resolve(here, '../..');

function parseArgs(argv) {
  const args = { base: '71b3e8893f56848732f49acb580ef461129dcc49', repo: defaultRepo };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--base') args.base = rest[++i];
    else if (a === '--repo') args.repo = rest[++i];
    else throw new Error(`unknown argument: ${a}`);
  }
  return args;
}

function gitShow(repo, rev, path) {
  try {
    return execFileSync('git', ['show', `${rev}:${path}`], { cwd: repo, encoding: 'utf8' });
  } catch {
    return null;
  }
}

function extractMetadataBlock(source) {
  const m = source.match(/export const metadata:\s*Metadata\s*=\s*\{([\s\S]*?)\n\};/);
  if (!m) throw new Error('metadata export block not found');
  return m[1];
}

function extractTopLevelDescription(metadataBlock) {
  const literal = metadataBlock.match(/\n\s*description:\s*\n\s*'([^']*)'/);
  if (literal) return literal[1];
  const sameLine = metadataBlock.match(/\n\s*description:\s*'([^']*)'/);
  if (sameLine) return sameLine[1];
  const tmpl = metadataBlock.match(/\n\s*description:\s*`([^`]*)`/);
  if (tmpl) return tmpl[1];
  throw new Error('metadata.description not found');
}

function normalizeDescriptionOnly(source) {
  // Replace only the top-level metadata.description assignment with a stable token.
  return source.replace(
    /(export const metadata:\s*Metadata\s*=\s*\{[\s\S]*?\n\s*)description:\s*(?:\n\s*)?(?:'[^']*'|`[^`]*`)(,?)/,
    '$1description: __ALLOWED_DESCRIPTION__$2',
  );
}

function outsideMetadata(source) {
  return source.replace(/export const metadata:\s*Metadata\s*=\s*\{[\s\S]*?\n\};/, 'export const metadata = __METADATA__;');
}

function assertNoFormBehaviorDrift(base, cand) {
  const markers = ['OemRfqForm', 'LeadAttributionCapture', 'partner-api', 'lead-attribution', '/contact'];
  for (const marker of markers) {
    const b = base.includes(marker);
    const c = cand.includes(marker);
    if (b !== c) {
      throw new Error(`form/G5/contact marker drift for ${marker}: base=${b} candidate=${c}`);
    }
  }
}

function loadAllowlist(repo) {
  const path = join(repo, 'docs/geo/packages/geo-fix-01/FIELD-ALLOWLIST.json');
  if (!existsSync(path)) throw new Error(`missing ${path}`);
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function assertMetaDescriptionOnly({ repoRoot, baseCommit, allowlist }) {
  const failures = [];
  const notes = [];
  for (const entry of allowlist.entries) {
    const base = gitShow(repoRoot, baseCommit, entry.path);
    if (base == null) {
      failures.push(`${entry.path}: missing in base ${baseCommit}`);
      continue;
    }
    const candPath = join(repoRoot, entry.path);
    if (!existsSync(candPath)) {
      failures.push(`${entry.path}: missing in candidate worktree`);
      continue;
    }
    const cand = readFileSync(candPath, 'utf8');
    try {
      const block = extractMetadataBlock(cand);
      const desc = extractTopLevelDescription(block);
      if (desc !== entry.allowed_description) {
        failures.push(
          `${entry.path}: description mismatch\n  expected ${entry.allowed_description}\n  got      ${desc}`,
        );
      }
      if (desc.length !== entry.allowed_description_chars) {
        failures.push(
          `${entry.path}: description length ${desc.length} != ${entry.allowed_description_chars}`,
        );
      }
      const normBase = normalizeDescriptionOnly(base);
      const normCand = normalizeDescriptionOnly(cand);
      if (normBase !== normCand) {
        failures.push(
          `${entry.path}: changes are not limited to metadata.description (normalized files differ)`,
        );
      }
      if (outsideMetadata(base) !== outsideMetadata(cand)) {
        failures.push(`${entry.path}: page body/imports outside metadata changed`);
      }
      assertNoFormBehaviorDrift(base, cand);
      notes.push(`OK description-only ${entry.path} (${desc.length} chars)`);
    } catch (err) {
      failures.push(`${entry.path}: ${err.message}`);
    }
  }
  for (const path of allowlist.never_copy || []) {
    notes.push(`never_copy ${path}`);
  }
  return { failures, notes };
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = parseArgs(process.argv);
  const repoRoot = resolve(args.repo);
  const allowlist = loadAllowlist(repoRoot);
  const result = assertMetaDescriptionOnly({
    repoRoot,
    baseCommit: args.base || allowlist.base_commit,
    allowlist,
  });
  for (const n of result.notes) console.log(n);
  if (result.failures.length) {
    for (const f of result.failures) console.error(`FAIL ${f}`);
    process.exit(1);
  }
  console.log(`OK field-level Meta Description allowlist (${allowlist.entries.length} files)`);
}
