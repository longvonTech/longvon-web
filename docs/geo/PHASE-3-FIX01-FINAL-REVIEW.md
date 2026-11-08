# PHASE-3 FIX-01 Final Review

**Verdict:** `TECHNICALLY VERIFIED — NOT PRODUCTION READY`

## B1. Candidate identity

| Item | Value | Notes |
|---|---|---|
| Branch | `geo/fix-01-phase2-candidate` | Isolated worktree `/private/tmp/longvon-geo-phase2-candidate` |
| Phase 2D package commit (payload code freeze) | `8e41fd4c6cf8f934ded7b8b87ddebc35a61e1ecf` | **Unique technical payload identity** — do not confuse with branch tip |
| Branch tip at audit start | `b2cdb329fb04b4b8353295b79dc76611ccdd181e` | Docs/pins after package commit |
| Phase 3 package | `GEO-FIX-01-PHASE-3` / `3.0.0` | Same payload source hashes as 2D.1; refreshed production `predeploy_sha256` pins only |
| Phase 2D Manifest SHA256 | `f09887060cc33fe8447ac23badbe69596a20ace3a80709680181b4fa4b1cd703` | Historical |
| Phase 3 Manifest SHA256 | `3f4dbc71e2a005c7d07e08b9f4d8d9de1a2c8a55fc8fd4e59e319a9b3dbc794e` | Changed because predeploy pins + package metadata updated |
| SHA256SUMS SHA256 | `1dc76049d734af7dd3ee6863b522d1a8a8edbf2fefc12a3a0c969f83c0488408` | Payload inventory (source hashes unchanged) |
| COPY | 30 | 3 ADD + 27 REPLACE |
| DELETE | 1 | `apps/web/components/HtmlLang.tsx` |
| Non-copy entries | 2 | `i18n-routes.spec.mjs`, `verify-site-url.mjs` |

**Package commit ≠ Branch tip:** Branch tip may move with docs; Option B bytes are pinned by payload `source_sha256` and package commit `8e41fd4…`. Phase 3 only refreshed *production predeploy* pins for deploy-time conflict detection.

## B2. Field-level Meta protection

Automated: `node scripts/geo/assert-meta-description-only.mjs`

| Page | Allowed change | Target length | Measured | Result |
|---|---|---|---|---|
| `/en/smart-ring-manufacturer` | `metadata.description` only | 145 | 145 | PASS |
| `/en/partner/oem` | `metadata.description` only | 152 | 152 | PASS |

Forbidden areas (body, other metadata, OEM form, G5, Contact business flow) — covered by assert + unit tests (`allow_metadata_description_only`, description-only diffs vs base).

## B3. Contact behavior

| Layer | Expected | Observed |
|---|---|---|
| Production nginx | 301 `/contact` → `/partner/oem` | **Confirmed** in `/etc/nginx/sites-enabled/mateyou` |
| Candidate `next.config.ts` | Local fallback only | Present in candidate; `never_copy` in denylist/assert |
| Option B COPY | Must exclude `next.config.ts` | Confirmed absent from copy set |
| Candidate SSR | 308 `/contact` → `/partner/oem` | `CANDIDATE_SSR_PASS` on port 3255 |

## B4. Full retest (Phase 3)

Commands (candidate worktree, `NEXT_PUBLIC_SITE_URL=https://www.longvon.com`):

```text
node scripts/geo/assert-meta-description-only.mjs
node --test scripts/geo/assert-meta-description-only.spec.mjs \
  scripts/geo/fix-01-deploy.spec.mjs apps/web/lib/i18n-routes.spec.mjs
npm run build --workspace=apps/web
./node_modules/.bin/tsc --noEmit -p apps/web/tsconfig.json
npm run lint --workspace=apps/web
# plus standalone SSR smoke on :3255
```

| Suite | Result |
|---|---|
| Field-level Meta assert | PASS (2 files; next.config never_copy) |
| Node tests | **26/26 PASS** |
| Production build | PASS (Next.js 15.5.19) |
| TypeScript `--noEmit` | PASS (exit 0) |
| Lint | PASS with pre-existing hook dependency warnings only |
| SSR home / OEM / manufacturer `html lang` | PASS (`zh-CN` / `en` / `en`) |
| Contact → OEM (candidate next.config) | PASS 308 |
| Live production Meta/lang | Still old (pre-deploy) — expected |

G5 / OEM form denylist hashes on production (read-only):

| File | Production SHA256 |
|---|---|
| `OemRfqForm.tsx` | `70a9c1aafa3fb30260bb059ec41f4a62bf57857e207d94ab628b5b778c60c9c3` |
| `partner-api.ts` | `2b7f56604d6f4150f410445ff1e387513f38ce98701551f3d908e357523b4b05` |
| `LeadAttributionCapture.tsx` | `56abca827e24d24c50908b8f56aa9607f4aaf7ec7b0544e59dacd6bb50869682` |
| `lead-attribution.ts` | `a96d88a63f2834e72af9aaa6a1cd0b6bc4fc512ced4b74fc5ba96786c2ed9838` |
| `next.config.ts` | `48fe0a78b857e4108ebab339433795c1a3a57e618d8955e3f467ab8d09cd8e91` |

These remain outside Option B COPY.

## B5. Unique candidate statement

- **Unique technical payload:** Phase 2D commit `8e41fd4…` / package bytes unchanged.
- **Phase 3 audit overlay:** Manifest `GEO-FIX-01-PHASE-3` `3.0.0` with fresh predeploy pins (`3f4dbc71e2a005c7d07e08b9f4d8d9de1a2c8a55fc8fd4e59e319a9b3dbc794e`).
- Production backup/rollback retention: **incomplete** → cannot approve release.

**Status:** 已验证（技术） / **未上线** / **不可自动批准发布**

