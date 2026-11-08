/**
 * GEO-FIX-01 deploy safety tests. Local fixtures only. Never contacts production.
 *
 *   node --test scripts/geo/fix-01-deploy.spec.mjs
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  assertCopySetSafe,
  assertDestructivePath,
  destFile,
  executePlan,
  loadJson,
  pathOverlaps,
  planWhitelistDeploy,
  selectCopyEntries,
  verifyProtect,
  verifySource,
} from './lib/fix-01-deploy.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');
const pkgDir = join(repoRoot, 'docs/geo/packages/geo-fix-01');
const manifest = loadJson(join(pkgDir, 'MANIFEST.json'));
const denylist = loadJson(join(pkgDir, 'DENYLIST.json'));

function sha(s) {
  return createHash('sha256').update(s).digest('hex');
}

function fixtureRoot() {
  return mkdtempSync(join(tmpdir(), 'fix01-'));
}

function write(p, contents) {
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, contents);
}

function miniManifest(overrides = {}) {
  const payload = 'docs/geo/packages/geo-fix-01/payload/apps/web/keep.txt';
  const body = 'keep\n';
  return {
    production_root: '/root/mateyou',
    payload_root: 'docs/geo/packages/geo-fix-01/payload',
    counts: { copy_to_production: 1, manifest_entries: 1 },
    files: [
      {
        action: 'REPLACE',
        source_path: 'apps/web/keep.txt',
        destination_path: '/root/mateyou/apps/web/keep.txt',
        copy_to_production: true,
        payload_path: payload,
        source_sha256: sha(body),
      },
    ],
    ...overrides,
  };
}

test('manifest copy selection is 30 unique ADD/REPLACE files', () => {
  const copy = selectCopyEntries(manifest);
  assert.equal(copy.length, 30);
  assert.equal(copy.filter((f) => f.action === 'ADD').length, 3);
  assert.equal(copy.filter((f) => f.action === 'REPLACE').length, 27);
  const dests = new Set(copy.map((f) => f.destination_path));
  const srcs = new Set(copy.map((f) => f.source_path));
  assert.equal(dests.size, 30);
  assert.equal(srcs.size, 30);
  assert.ok(copy.some((f) => f.source_path.endsWith('en/smart-ring-manufacturer/page.tsx')));
  assert.ok(copy.some((f) => f.source_path.endsWith('en/partner/oem/page.tsx')));
  assert.ok(!copy.some((f) => f.source_path.endsWith('next.config.ts')));
  assert.ok(!copy.some((f) => f.source_path.endsWith('i18n-routes.spec.mjs')));
  assert.ok(!copy.some((f) => f.source_path.endsWith('HtmlLang.tsx')));
  assert.ok(!copy.some((f) => f.source_path.includes('verify-site-url.mjs')));
  assertCopySetSafe(manifest, denylist);
});

test('duplicate destinations are rejected', () => {
  const dup = structuredClone(manifest);
  dup.files = [
    ...dup.files.filter((f) => f.copy_to_production).slice(0, 2).map((f, i) => ({
      ...f,
      source_path: `apps/web/dup-${i}.tsx`,
      payload_path: f.payload_path,
      destination_path: '/root/mateyou/apps/web/app/layout.tsx',
    })),
  ];
  dup.counts = { ...dup.counts, copy_to_production: 2 };
  assert.throws(() => selectCopyEntries(dup), /duplicate destination/);
});

test('path traversal with ../ is rejected', () => {
  assert.throws(
    () => destFile('/var/data', '/root/mateyou/apps/web/../../../../etc/passwd', '/root/mateyou'),
    /traversal/,
  );
});

test('nested traversal is rejected', () => {
  assert.throws(
    () =>
      destFile(
        '/var/data',
        '/root/mateyou/apps/web/app/authors/[id]/../../../etc/passwd',
        '/root/mateyou',
      ),
    /traversal/,
  );
});

test('absolute path escape is rejected', () => {
  assert.throws(
    () => destFile('/var/data', '/etc/passwd', '/root/mateyou'),
    /not under production_root/,
  );
  assert.throws(
    () => destFile('/var/data', '/root/mateyou-evil/apps/web/x', '/root/mateyou'),
    /not under production_root/,
  );
});

test('valid nested Next.js [id] path stays inside target', () => {
  const dest = destFile(
    '/var/data',
    '/root/mateyou/apps/web/app/authors/[id]/page.tsx',
    '/root/mateyou',
  );
  assert.equal(dest, '/var/data/apps/web/app/authors/[id]/page.tsx');
  const slug = destFile(
    '/tmp/fix01-target',
    '/root/mateyou/apps/web/app/knowledge/[slug]/page.tsx',
    '/root/mateyou',
  );
  assert.equal(slug, '/tmp/fix01-target/apps/web/app/knowledge/[slug]/page.tsx');
});

test('real package source verification still matches expected counts', () => {
  const result = verifySource({ repoRoot, manifest, denylist });
  assert.deepEqual(result.failures, []);
});

test('unexpected payload files fail source verification', () => {
  const dir = fixtureRoot();
  try {
    const payloadRel = 'docs/geo/packages/geo-fix-01/payload';
    write(join(dir, payloadRel, 'apps/web/keep.txt'), 'keep\n');
    write(join(dir, payloadRel, 'apps/web/extra.txt'), 'nope\n');
    const result = verifySource({
      repoRoot: dir,
      manifest: miniManifest(),
      denylist: { entries: [] },
    });
    assert.ok(result.failures.some((f) => f.includes('unexpected payload file')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('missing payload files fail source verification', () => {
  const dir = fixtureRoot();
  try {
    mkdirSync(join(dir, 'docs/geo/packages/geo-fix-01/payload'), { recursive: true });
    const result = verifySource({
      repoRoot: dir,
      manifest: miniManifest(),
      denylist: { entries: [] },
    });
    assert.ok(result.failures.some((f) => f.includes('required payload missing')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('hash mismatch fails source verification', () => {
  const dir = fixtureRoot();
  try {
    const payloadRel = 'docs/geo/packages/geo-fix-01/payload';
    write(join(dir, payloadRel, 'apps/web/keep.txt'), 'tampered\n');
    const result = verifySource({
      repoRoot: dir,
      manifest: miniManifest(),
      denylist: { entries: [] },
    });
    assert.ok(result.failures.some((f) => f.includes('payload hash mismatch')));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('protected path overlap fails protect and copy planning', () => {
  const overlapping = miniManifest({
    files: [
      {
        action: 'REPLACE',
        source_path: 'apps/api/src/main.ts',
        destination_path: '/root/mateyou/apps/api/src/main.ts',
        copy_to_production: true,
        payload_path: 'docs/geo/packages/geo-fix-01/payload/apps/web/keep.txt',
        source_sha256: sha('keep\n'),
      },
    ],
  });
  const deny = { entries: [{ path: 'apps/api/', kind: 'directory', protect: 'must_not_touch' }] };
  assert.throws(() => assertCopySetSafe(overlapping, deny), /overlaps denylist|forbidden/);
  assert.equal(pathOverlaps('apps/api/src/main.ts', 'apps/api/'), true);
  const target = fixtureRoot();
  try {
    mkdirSync(join(target, 'apps/api'), { recursive: true });
    const result = verifyProtect({ target, manifest: overlapping, denylist: deny });
    assert.ok(result.failures.length > 0);
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
});

test('empty destructive-command variables are rejected', () => {
  assert.throws(
    () => assertDestructivePath({ path: '', root: '/root/mateyou', expect: '/root/mateyou/x' }),
    /path is empty/,
  );
  assert.throws(
    () => assertDestructivePath({ path: '/root/mateyou/x', root: '', expect: '/root/mateyou/x' }),
    /root is empty/,
  );
  assert.throws(
    () => assertDestructivePath({ path: '/root/mateyou/x', root: '/root/mateyou', expect: '' }),
    /expect is empty/,
  );
  assert.throws(
    () =>
      assertDestructivePath({
        path: '/root/mateyou/apps/web/.next/standalone',
        root: '/root/mateyou',
        expect: '/root/mateyou/apps/web/.next/standalone',
        requireBackup: '',
      }),
    /backup path is empty/,
  );
});

test('invalid production root is rejected', () => {
  assert.throws(() => destFile('/var/data', '/root/mateyou/apps/web/x', ''), /invalid production_root/);
  assert.throws(() => destFile('/var/data', '/root/mateyou/apps/web/x', '/'), /invalid production_root/);
  assert.throws(() => destFile('/var/data', '/root/mateyou/apps/web/x', '..'), /invalid production_root/);
  assert.throws(() => destFile('', '/root/mateyou/apps/web/x', '/root/mateyou'), /invalid target root/);
});

test('protect reports skipped secret hashes and requires must_not_touch to exist', () => {
  const target = fixtureRoot();
  try {
    mkdirSync(join(target, 'apps/api'), { recursive: true });
    mkdirSync(join(target, 'packages/database'), { recursive: true });
    mkdirSync(join(target, 'infra'), { recursive: true });
    write(join(target, '.env.production'), 'SECRET=1\n');
    write(join(target, 'ecosystem.config.js'), 'module.exports = {}\n');
    const deny = {
      entries: [
        { path: 'apps/api/', kind: 'directory', protect: 'must_not_touch', sha256: null },
        { path: 'packages/database/', kind: 'directory', protect: 'must_not_touch', sha256: null },
        { path: 'infra/', kind: 'directory', protect: 'must_not_touch', sha256: null },
        {
          path: '.env.production',
          kind: 'file',
          protect: 'must_not_touch',
          sha256: 'deadbeef',
        },
        { path: 'ecosystem.config.js', kind: 'file', protect: 'must_not_touch', sha256: null },
        { path: 'scripts/deploy.sh', kind: 'file', protect: 'must_not_run', sha256: null },
      ],
    };
    const tiny = miniManifest();
    tiny.files[0].payload_path = manifest.files.find((f) => f.copy_to_production).payload_path;
    tiny.files[0].source_sha256 = manifest.files.find((f) => f.copy_to_production).source_sha256;
    tiny.files[0].source_path = 'apps/web/middleware.ts';
    tiny.files[0].destination_path = '/root/mateyou/apps/web/middleware.ts';
    const result = verifyProtect({
      target,
      manifest,
      denylist: deny,
    });
    assert.deepEqual(result.failures, []);
    assert.ok(result.notes.some((n) => /SKIP hash/.test(n) && n.includes('.env.production')));
    assert.ok(result.notes.some((n) => /SKIP execute/.test(n) && n.includes('deploy.sh')));
    assert.ok(result.notes.some((n) => n.includes('copy set excludes apps/api/')));
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
});

test('copy helper dry-run is default; execute without flag fails', () => {
  const copyCli = join(repoRoot, 'scripts/geo/copy-fix-01-whitelist.mjs');
  const target = fixtureRoot();
  try {
    const denied = spawnSync(process.execPath, [copyCli, '--target', target, '--execute'], {
      encoding: 'utf8',
    });
    assert.notEqual(denied.status, 0);
    assert.match(denied.stderr, /refusing to write/);
    const dry = spawnSync(process.execPath, [copyCli, '--target', target, '--dry-run'], {
      encoding: 'utf8',
    });
    assert.equal(dry.status, 0, dry.stderr);
    assert.match(dry.stdout, /DRY-RUN COPY 30 files, DELETE 1 files/);
    assert.equal(existsSync(join(target, 'apps/web/middleware.ts')), false);
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
});

test('copy helper execute writes only whitelist files then delete', () => {
  const target = fixtureRoot();
  try {
    write(join(target, 'apps/web/components/HtmlLang.tsx'), 'client-lang\n');
    write(join(target, 'apps/api/secret.ts'), 'nope\n');
    const plan = planWhitelistDeploy({ repoRoot, manifest, denylist, target });
    assert.equal(plan.copyCount, 30);
    assert.equal(plan.deleteCount, 1);
    const result = executePlan(plan, { write: true });
    assert.equal(result.copied, 30);
    assert.equal(result.deleted, 1);
    assert.equal(existsSync(join(target, 'apps/web/middleware.ts')), true);
    assert.equal(existsSync(join(target, 'apps/web/components/HtmlLang.tsx')), false);
    assert.equal(readFileSync(join(target, 'apps/api/secret.ts'), 'utf8'), 'nope\n');
    assert.equal(existsSync(join(target, 'apps/web/lib/i18n-routes.spec.mjs')), false);
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
});

test('assert-fix-01-path CLI pins and rejects empty --path', () => {
  const cli = join(repoRoot, 'scripts/geo/assert-fix-01-path.mjs');
  const dir = fixtureRoot();
  try {
    const empty = spawnSync(
      process.execPath,
      [cli, '--path', '', '--root', dir, '--expect', join(dir, 'x')],
      { encoding: 'utf8' },
    );
    assert.notEqual(empty.status, 0);
    assert.match(empty.stderr, /empty/);
    const expect = join(dir, 'apps/web/.next/static');
    mkdirSync(expect, { recursive: true });
    const ok = spawnSync(
      process.execPath,
      [cli, '--path', expect, '--root', dir, '--expect', expect],
      { encoding: 'utf8' },
    );
    assert.equal(ok.status, 0, ok.stderr);
    assert.match(ok.stdout, /^PINNED /);
    const bakMissing = spawnSync(
      process.execPath,
      [
        cli,
        '--path',
        expect,
        '--root',
        dir,
        '--expect',
        expect,
        '--require-backup',
        join(dir, '_rollback/missing'),
      ],
      { encoding: 'utf8' },
    );
    assert.notEqual(bakMissing.status, 0);
    assert.match(bakMissing.stderr, /backup missing/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
