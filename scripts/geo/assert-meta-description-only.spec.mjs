/**
 * Field-level Meta Description allowlist tests.
 *
 *   node --test scripts/geo/assert-meta-description-only.spec.mjs
 */
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { assertMetaDescriptionOnly } from './assert-meta-description-only.mjs';
import { assertCopySetSafe, denylistBlocksCopy, loadJson } from './lib/fix-01-deploy.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');

test('allow_metadata_description_only does not block COPY', () => {
  assert.equal(
    denylistBlocksCopy({ path: 'apps/web/app/en/smart-ring-manufacturer/page.tsx', protect: 'allow_metadata_description_only' }),
    false,
  );
  assert.equal(denylistBlocksCopy({ path: 'apps/web/next.config.ts', protect: 'must_not_change' }), true);
});

test('candidate manufacturer and OEM diffs are description-only vs base', () => {
  const allowlist = loadJson(join(repoRoot, 'docs/geo/packages/geo-fix-01/FIELD-ALLOWLIST.json'));
  const result = assertMetaDescriptionOnly({
    repoRoot,
    baseCommit: allowlist.base_commit,
    allowlist,
  });
  assert.deepEqual(result.failures, []);
});

test('body change beyond description is rejected', () => {
  const dir = mkdtempSync(join(tmpdir(), 'meta-only-'));
  try {
    spawnSync('git', ['init'], { cwd: dir, encoding: 'utf8' });
    spawnSync('git', ['config', 'user.email', 'test@example.com'], { cwd: dir });
    spawnSync('git', ['config', 'user.name', 'test'], { cwd: dir });
    const rel = 'apps/web/app/en/smart-ring-manufacturer/page.tsx';
    mkdirSync(dirname(join(dir, rel)), { recursive: true });
    const base = `import type { Metadata } from 'next';\nexport const metadata: Metadata = {\n  title: { absolute: 'T' },\n  description: 'old description text here that is not the allowed one yetxx',\n};\nexport default function Page(){return <main>BODY</main>}\n`;
    writeFileSync(join(dir, rel), base);
    spawnSync('git', ['add', '.'], { cwd: dir });
    spawnSync('git', ['commit', '-m', 'base'], { cwd: dir });
    const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).stdout.trim();
    const allowed =
      'LONGVON is a smart ring manufacturer offering OEM/ODM, custom hardware, firmware, health algorithms, apps, SDK/API integration and manufacturing.';
    writeFileSync(
      join(dir, rel),
      base
        .replace("description: 'old description text here that is not the allowed one yetxx'", `description:\n    '${allowed}'`)
        .replace('BODY', 'CHANGED BODY'),
    );
    mkdirSync(join(dir, 'docs/geo/packages/geo-fix-01'), { recursive: true });
    writeFileSync(
      join(dir, 'docs/geo/packages/geo-fix-01/FIELD-ALLOWLIST.json'),
      JSON.stringify({
        base_commit: head,
        entries: [
          {
            path: rel,
            allowed_description: allowed,
            allowed_description_chars: allowed.length,
          },
        ],
      }),
    );
    const allowlist = JSON.parse(
      readFileSync(join(dir, 'docs/geo/packages/geo-fix-01/FIELD-ALLOWLIST.json'), 'utf8'),
    );
    const result = assertMetaDescriptionOnly({ repoRoot: dir, baseCommit: head, allowlist });
    assert.ok(result.failures.some((f) => /body|normalized/i.test(f)));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('CLI passes on candidate worktree', () => {
  const cli = join(repoRoot, 'scripts/geo/assert-meta-description-only.mjs');
  const run = spawnSync(process.execPath, [cli, '--repo', repoRoot], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr || run.stdout);
  assert.match(run.stdout, /OK field-level/);
});

test('Phase 2D manifest copy set includes manufacturer and excludes next.config', () => {
  const manifest = loadJson(join(repoRoot, 'docs/geo/packages/geo-fix-01/MANIFEST.json'));
  const denylist = loadJson(join(repoRoot, 'docs/geo/packages/geo-fix-01/DENYLIST.json'));
  const copy = assertCopySetSafe(manifest, denylist);
  assert.equal(copy.length, 30);
  assert.ok(copy.some((f) => f.source_path.endsWith('en/smart-ring-manufacturer/page.tsx')));
  assert.ok(copy.some((f) => f.source_path.endsWith('en/partner/oem/page.tsx')));
  assert.ok(!copy.some((f) => f.source_path.endsWith('next.config.ts')));
  assert.equal(manifest.files.filter((f) => f.action === 'DELETE').length, 1);
});
