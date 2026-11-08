/**
 * GEO-FIX-01 deploy safety helpers. Pure functions for the verifier, whitelist
 * copy helper, path guard, and tests. Never contacts production by itself.
 */
import { createHash } from 'node:crypto';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

export const ALLOWED_COPY_ACTIONS = new Set(['ADD', 'REPLACE']);
export const ALLOWED_ACTIONS = new Set(['ADD', 'REPLACE', 'DELETE']);
export const FORBIDDEN_COPY_PREFIXES = [
  'apps/api',
  'packages/database',
  'infra',
  '.env.production',
  'ecosystem.config.js',
];
export const NEVER_HASH_PATHS = new Set(['.env.production']);
export const REQUIRED_OUTSIDE_COPY = [
  'apps/api/',
  'packages/database/',
  'infra/',
  '.env.production',
  'ecosystem.config.js',
];

export function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

export function loadJson(path) {
  if (!existsSync(path)) throw new Error(`missing ${path}`);
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function posixRel(from, to) {
  return relative(from, to).split(sep).join('/');
}

export function posixNorm(p) {
  return String(p)
    .replace(/\\/g, '/')
    .replace(/\/+$/, '');
}

export function pathOverlaps(a, b) {
  const x = posixNorm(a);
  const y = posixNorm(b);
  if (!x || !y) return false;
  return x === y || x.startsWith(`${y}/`) || y.startsWith(`${x}/`);
}

export function validateProductionRoot(productionRoot) {
  if (productionRoot == null || String(productionRoot).trim() === '') {
    throw new Error('invalid production_root: empty');
  }
  const raw = String(productionRoot).trim();
  if (raw === '.' || raw === '..' || raw === '/') {
    throw new Error(`invalid production_root: ${raw}`);
  }
  if (!raw.startsWith('/')) {
    throw new Error(`invalid production_root: must be absolute (${raw})`);
  }
  if (raw.split('/').includes('..')) {
    throw new Error(`invalid production_root: traversal (${raw})`);
  }
  return posixNorm(raw);
}

export function assertInside(root, candidate) {
  const rootResolved = resolve(root);
  const candResolved = resolve(candidate);
  const rel = relative(rootResolved, candResolved);
  if (rel === '') return candResolved;
  if (rel.startsWith('..') || isAbsolute(rel)) {
    throw new Error(`path escapes root ${rootResolved}: ${candResolved}`);
  }
  return candResolved;
}

function rejectUnsafeSegments(label, value) {
  if (value == null || String(value).trim() === '') {
    throw new Error(`${label} is empty`);
  }
  if (String(value).includes('\0')) {
    throw new Error(`${label} contains NUL`);
  }
  const n = String(value).replace(/\\/g, '/');
  if (n.split('/').includes('..')) {
    throw new Error(`${label} contains path traversal: ${value}`);
  }
  return n;
}

export function confineRelative(root, relPath, label = 'path') {
  const n = rejectUnsafeSegments(label, relPath);
  if (isAbsolute(n) || n.startsWith('/')) {
    throw new Error(`${label} must be relative, got ${relPath}`);
  }
  return assertInside(resolve(root), resolve(root, n));
}

/**
 * Map a manifest destination_path onto --target. Destinations must stay under
 * production_root in the manifest, then under the resolved target on disk.
 */
export function destFile(targetRoot, destinationPath, productionRoot) {
  const prod = validateProductionRoot(productionRoot);
  if (targetRoot == null || String(targetRoot).trim() === '') {
    throw new Error('invalid target root: empty');
  }
  const target = resolve(targetRoot);
  if (target === '/' || target === '.') {
    throw new Error(`invalid target root: ${target}`);
  }
  const destRaw = rejectUnsafeSegments('destination_path', destinationPath);
  const prefix = `${prod}/`;
  if (destRaw !== prod && !destRaw.startsWith(prefix)) {
    throw new Error(`destination_path not under production_root: ${destinationPath}`);
  }
  const rel = destRaw === prod ? '' : destRaw.slice(prefix.length);
  if (!rel) {
    throw new Error(`destination_path must be a file under production_root, not the root itself`);
  }
  if (isAbsolute(rel) || rel.startsWith('/')) {
    throw new Error(`destination_path relative part is absolute: ${destinationPath}`);
  }
  return assertInside(target, resolve(target, rel));
}

export function walkFiles(dir) {
  const abs = resolve(dir);
  if (!existsSync(abs)) return [];
  const names = readdirSync(abs, { recursive: true });
  const out = [];
  for (const rel of names) {
    const p = join(abs, rel);
    const st = lstatSync(p);
    if (st.isSymbolicLink()) {
      throw new Error(`payload must not contain symlinks: ${p}`);
    }
    if (st.isFile()) out.push(p);
  }
  return out.sort();
}

export function selectCopyEntries(manifest) {
  if (!manifest?.files || !Array.isArray(manifest.files)) {
    throw new Error('manifest.files missing');
  }
  const copy = manifest.files.filter((f) => f.copy_to_production);
  const dests = new Set();
  const srcs = new Set();
  for (const file of copy) {
    if (!ALLOWED_COPY_ACTIONS.has(file.action)) {
      throw new Error(`copy_to_production with unexpected action ${file.action}: ${file.source_path}`);
    }
    if (!file.payload_path) {
      throw new Error(`copy missing payload_path: ${file.source_path}`);
    }
    if (!file.destination_path) {
      throw new Error(`copy missing destination_path: ${file.source_path}`);
    }
    if (file.payload_path.endsWith('/') || file.source_path?.endsWith('/')) {
      throw new Error(`directory copy forbidden: ${file.source_path}`);
    }
    if (dests.has(file.destination_path)) {
      throw new Error(`duplicate destination: ${file.destination_path}`);
    }
    dests.add(file.destination_path);
    if (srcs.has(file.source_path)) {
      throw new Error(`duplicate source: ${file.source_path}`);
    }
    srcs.add(file.source_path);
  }
  return copy;
}

export function destinationRel(destinationPath, productionRoot) {
  const prod = validateProductionRoot(productionRoot);
  const dest = destFile(prod, destinationPath, prod);
  return posixRel(prod, dest);
}

function assertNotForbiddenCopy(rel) {
  for (const prefix of FORBIDDEN_COPY_PREFIXES) {
    if (pathOverlaps(rel, prefix)) {
      throw new Error(`copy set includes forbidden path ${prefix}: ${rel}`);
    }
  }
}

/** Denylist modes that block whole-file COPY. Field-level Meta allow modes do not. */
export const COPY_BLOCKING_PROTECT = new Set([
  'must_not_change',
  'must_not_touch',
  'must_exist',
  'must_not_run',
]);

export function denylistBlocksCopy(entry) {
  if (!entry) return false;
  if (entry.protect === 'allow_metadata_description_only') return false;
  if (entry.protect == null) return true;
  return COPY_BLOCKING_PROTECT.has(entry.protect);
}

export function assertCopySetSafe(manifest, denylist) {
  const copy = selectCopyEntries(manifest);
  const productionRoot = validateProductionRoot(manifest.production_root);
  for (const file of copy) {
    destFile(productionRoot, file.destination_path, productionRoot);
    const rel = destinationRel(file.destination_path, productionRoot);
    assertNotForbiddenCopy(rel);
    if (denylist?.entries) {
      for (const entry of denylist.entries) {
        if (!denylistBlocksCopy(entry)) continue;
        if (pathOverlaps(rel, entry.path)) {
          throw new Error(`copy overlaps denylist ${entry.path} via ${rel}`);
        }
      }
    }
  }
  if (manifest.counts && copy.length !== manifest.counts.copy_to_production) {
    throw new Error(
      `copy_to_production count drifted: files=${copy.length} counts=${manifest.counts.copy_to_production}`,
    );
  }
  return copy;
}

export function checkLayoutKeepsG5(path, failures, label) {
  if (!existsSync(path)) return;
  const text = readFileSync(path, 'utf8');
  if (!text.includes('LeadAttributionCapture')) {
    failures.push(`${label}: layout.tsx missing LeadAttributionCapture (${path})`);
  }
  if (!text.includes('<html lang={lang}>')) {
    failures.push(`${label}: layout.tsx missing <html lang={lang}> (${path})`);
  }
}

export function verifySource({ repoRoot, manifest, denylist }) {
  const failures = [];
  const notes = [];
  const root = resolve(repoRoot);
  try {
    assertCopySetSafe(manifest, denylist);
  } catch (err) {
    failures.push(err.message);
  }

  for (const file of manifest.files) {
    if (!ALLOWED_ACTIONS.has(file.action)) {
      failures.push(`unexpected action ${file.action}: ${file.source_path}`);
    }
    try {
      destFile(manifest.production_root, file.destination_path, manifest.production_root);
    } catch (err) {
      failures.push(`destination confinement ${file.source_path}: ${err.message}`);
    }
  }

  const expected = new Set(
    manifest.files.filter((f) => f.payload_path).map((f) => posixNorm(f.payload_path)),
  );
  const payloadRoot = confineRelative(root, manifest.payload_root, 'payload_root');
  let actual = [];
  try {
    actual = walkFiles(payloadRoot).map((p) => posixNorm(posixRel(root, p)));
  } catch (err) {
    failures.push(err.message);
  }
  const actualSet = new Set(actual);

  for (const a of actualSet) {
    if (!expected.has(a)) failures.push(`unexpected payload file: ${a}`);
  }
  for (const e of expected) {
    if (!actualSet.has(e)) failures.push(`required payload missing: ${e}`);
  }
  if (actualSet.size !== expected.size) {
    failures.push(`payload file count drifted: disk=${actualSet.size} manifest=${expected.size}`);
  }

  for (const file of manifest.files) {
    if (file.action === 'DELETE') {
      if (file.payload_path) {
        failures.push(`DELETE payload must not exist: ${file.source_path}`);
      }
      continue;
    }
    if (!file.payload_path) {
      failures.push(`missing payload_path for ${file.source_path}`);
      continue;
    }
    let payload;
    try {
      payload = confineRelative(root, file.payload_path, 'payload_path');
      assertInside(payloadRoot, payload);
    } catch (err) {
      failures.push(`payload confinement ${file.source_path}: ${err.message}`);
      continue;
    }
    if (!existsSync(payload)) {
      failures.push(`required payload missing: ${file.payload_path}`);
      continue;
    }
    const got = sha256File(payload);
    if (got !== file.source_sha256) {
      failures.push(
        `payload hash mismatch ${file.source_path}\n  expected ${file.source_sha256}\n  got      ${got}`,
      );
    }
  }

  const layoutPayload = manifest.files.find((f) => f.source_path === 'apps/web/app/layout.tsx');
  if (layoutPayload?.payload_path) {
    checkLayoutKeepsG5(join(root, layoutPayload.payload_path), failures, 'source');
  }

  if (manifest.counts) {
    if (manifest.files.length !== manifest.counts.manifest_entries) {
      failures.push(
        `manifest_entries count drifted: files=${manifest.files.length} counts=${manifest.counts.manifest_entries}`,
      );
    }
  }

  try {
    notes.push(`payload files ${expected.size}; copy_to_production ${selectCopyEntries(manifest).length}`);
  } catch (err) {
    notes.push(`payload files ${expected.size}; copy selection failed (${err.message})`);
  }
  return { failures, notes };
}

function targetDest(target, file, productionRoot, failures) {
  try {
    return destFile(target, file.destination_path, productionRoot);
  } catch (err) {
    failures.push(`path confinement ${file.source_path}: ${err.message}`);
    return null;
  }
}

export function verifyPredeploy({ target, manifest }) {
  const failures = [];
  const notes = [];
  const targetRoot = resolve(target);
  const productionRoot = manifest.production_root;
  for (const file of manifest.files) {
    if (!file.copy_to_production && file.action !== 'DELETE') continue;
    const dest = targetDest(targetRoot, file, productionRoot, failures);
    if (!dest) continue;
    const exists = existsSync(dest);
    if (file.action === 'ADD') {
      if (exists) failures.push(`predeploy: ADD path unexpectedly exists ${file.source_path} (${dest})`);
      continue;
    }
    if (file.action === 'DELETE' || file.action === 'REPLACE') {
      if (file.predeploy_must_exist && !exists) {
        failures.push(`predeploy: required file missing ${file.source_path} (${dest})`);
        continue;
      }
      if (exists && file.predeploy_sha256) {
        const got = sha256File(dest);
        if (got !== file.predeploy_sha256) {
          failures.push(
            `predeploy: hash mismatch ${file.source_path}\n  expected ${file.predeploy_sha256}\n  got      ${got}`,
          );
        }
      }
    }
  }
  return { failures, notes };
}

export function verifyPostdeploy({ target, manifest }) {
  const failures = [];
  const notes = [];
  const targetRoot = resolve(target);
  const productionRoot = manifest.production_root;
  for (const file of manifest.files) {
    const dest = targetDest(targetRoot, file, productionRoot, failures);
    if (!dest) continue;
    const exists = existsSync(dest);
    if (file.action === 'DELETE') {
      if (exists) failures.push(`postdeploy: DELETE path still present ${file.source_path} (${dest})`);
      continue;
    }
    if (!file.copy_to_production) continue;
    if (!exists) {
      failures.push(`postdeploy: required file missing ${file.source_path} (${dest})`);
      continue;
    }
    const got = sha256File(dest);
    if (got !== file.source_sha256) {
      failures.push(
        `postdeploy: hash mismatch ${file.source_path}\n  expected ${file.source_sha256}\n  got      ${got}`,
      );
    }
  }
  try {
    const layoutDest = destFile(targetRoot, '/root/mateyou/apps/web/app/layout.tsx', productionRoot);
    checkLayoutKeepsG5(layoutDest, failures, 'postdeploy');
  } catch (err) {
    failures.push(`postdeploy layout confinement: ${err.message}`);
  }
  return { failures, notes };
}

export function verifyProtect({ target, manifest, denylist }) {
  const failures = [];
  const notes = [];
  const targetRoot = resolve(target);
  let copy = [];
  try {
    copy = selectCopyEntries(manifest);
  } catch (err) {
    failures.push(`protect copy-set selection: ${err.message}`);
  }
  try {
    assertCopySetSafe(manifest, denylist);
  } catch (err) {
    failures.push(`protect copy-set: ${err.message}`);
  }
  const copyRels = [];
  for (const file of copy) {
    try {
      copyRels.push(destinationRel(file.destination_path, manifest.production_root));
    } catch (err) {
      failures.push(`protect dest ${file.source_path}: ${err.message}`);
    }
  }

  for (const prefix of REQUIRED_OUTSIDE_COPY) {
    if (copyRels.some((rel) => pathOverlaps(rel, prefix))) {
      failures.push(`protect: copy set includes forbidden ${prefix}`);
    } else {
      notes.push(`copy set excludes ${prefix}`);
    }
  }

  for (const entry of denylist.entries) {
    let dest;
    try {
      dest = confineRelative(targetRoot, entry.path, 'denylist path');
    } catch (err) {
      failures.push(`protect: denylist path unsafe ${entry.path}: ${err.message}`);
      continue;
    }

    for (const rel of copyRels) {
      if (!denylistBlocksCopy(entry)) continue;
      if (pathOverlaps(rel, entry.path)) {
        failures.push(`protect: copy overlaps denylist ${entry.path} via ${rel}`);
      }
    }

    if (entry.protect === 'must_not_run') {
      notes.push(`SKIP execute ${entry.path} (must_not_run; not invoked by FIX-01)`);
      continue;
    }

    const skipHash = NEVER_HASH_PATHS.has(posixNorm(entry.path)) || entry.protect === 'must_not_touch';

    if (!existsSync(dest)) {
      failures.push(`protect: missing ${entry.path} (${dest})`);
      continue;
    }

    const st = lstatSync(dest);
    if (entry.kind === 'directory' || st.isDirectory()) {
      notes.push(`exists directory ${entry.path} (not hashed)`);
      if (skipHash) notes.push(`SKIP hash ${entry.path} (${entry.protect})`);
      continue;
    }

    if (skipHash) {
      notes.push(`exists ${entry.path} (not hashed; ${entry.protect || 'secret'})`);
      if (entry.sha256) {
        notes.push(`SKIP hash secrets ${entry.path} even though denylist listed a hash`);
      }
      continue;
    }

    if (entry.sha256) {
      const got = sha256File(dest);
      if (got !== entry.sha256) {
        failures.push(
          `protect: denylist hash changed ${entry.path}\n  expected ${entry.sha256}\n  got      ${got}`,
        );
      }
    } else {
      notes.push(`exists ${entry.path} (no sha256 in denylist)`);
    }
  }

  return { failures, notes };
}

function assertParentSafe(targetRoot, dest) {
  const parent = dirname(dest);
  const root = resolve(targetRoot);
  if (resolve(parent) === root) return;
  assertInside(root, parent);
}

export function planWhitelistDeploy({ repoRoot, manifest, denylist, target }) {
  if (target == null || String(target).trim() === '') {
    throw new Error('invalid --target: empty');
  }
  const targetRoot = resolve(target);
  if (targetRoot === '/') {
    throw new Error('invalid --target: filesystem root');
  }
  const copy = assertCopySetSafe(manifest, denylist);
  const root = resolve(repoRoot);
  const payloadRoot = confineRelative(root, manifest.payload_root, 'payload_root');
  const ops = [];

  for (const file of copy) {
    const src = confineRelative(root, file.payload_path, 'payload_path');
    assertInside(payloadRoot, src);
    if (!existsSync(src) || !lstatSync(src).isFile()) {
      throw new Error(`copy source missing or not a file: ${file.payload_path}`);
    }
    const got = sha256File(src);
    if (got !== file.source_sha256) {
      throw new Error(
        `source hash mismatch ${file.source_path}\n  expected ${file.source_sha256}\n  got      ${got}`,
      );
    }
    const dest = destFile(targetRoot, file.destination_path, manifest.production_root);
    ops.push({
      op: 'copy',
      action: file.action,
      source_path: file.source_path,
      source: src,
      dest,
    });
  }

  const deletes = manifest.files.filter((f) => f.action === 'DELETE');
  for (const file of deletes) {
    const dest = destFile(targetRoot, file.destination_path, manifest.production_root);
    ops.push({ op: 'delete', action: 'DELETE', source_path: file.source_path, dest });
  }

  return {
    targetRoot,
    ops,
    copyCount: copy.length,
    deleteCount: deletes.length,
  };
}

export function executePlan(plan, { write }) {
  if (!write) {
    return { written: false, copied: 0, deleted: 0 };
  }
  let copied = 0;
  let deleted = 0;
  for (const op of plan.ops) {
    assertInside(plan.targetRoot, op.dest);
    if (op.op === 'copy') {
      assertParentSafe(plan.targetRoot, op.dest);
      mkdirSync(dirname(op.dest), { recursive: true });
      writeFileSync(op.dest, readFileSync(op.source), { mode: 0o644 });
      copied += 1;
    } else if (op.op === 'delete') {
      if (!existsSync(op.dest)) {
        throw new Error(`DELETE target missing: ${op.dest}`);
      }
      if (!lstatSync(op.dest).isFile()) {
        throw new Error(`DELETE refuses non-file: ${op.dest}`);
      }
      unlinkSync(op.dest);
      deleted += 1;
    } else {
      throw new Error(`unexpected op ${op.op}`);
    }
  }
  return { written: true, copied, deleted };
}

export function assertDestructivePath({ path, root, expect, requireBackup }) {
  if (path == null || String(path).trim() === '') {
    throw new Error('destructive path is empty');
  }
  if (root == null || String(root).trim() === '') {
    throw new Error('destructive root is empty');
  }
  if (expect == null || String(expect).trim() === '') {
    throw new Error('destructive expect is empty');
  }
  const resolvedRoot = resolve(root);
  if (resolvedRoot === '/') {
    throw new Error('destructive root must not be filesystem root');
  }
  const resolvedPath = resolve(path);
  const resolvedExpect = resolve(expect);
  assertInside(resolvedRoot, resolvedPath);
  assertInside(resolvedRoot, resolvedExpect);
  if (resolvedPath !== resolvedExpect) {
    throw new Error(`destructive path mismatch: got ${resolvedPath} expected ${resolvedExpect}`);
  }
  if (requireBackup !== undefined) {
    if (requireBackup == null || String(requireBackup).trim() === '') {
      throw new Error('backup path is empty');
    }
    const bak = resolve(requireBackup);
    assertInside(resolvedRoot, bak);
    if (!existsSync(bak)) {
      throw new Error(`required backup missing: ${bak}`);
    }
  }
  return resolvedPath;
}
