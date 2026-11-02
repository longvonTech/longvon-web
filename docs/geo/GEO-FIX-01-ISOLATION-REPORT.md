# GEO-FIX-01 Surgical Isolation Report

| Field | Value |
|---|---|
| Date | 2026-11-02 |
| Isolated branch | `geo/fix-01-isolated` |
| Isolated worktree | `/Users/libingshi/Downloads/mateyou-geo-fix-01-isolated` |
| Scratch branch (untouched) | `geo/fix-01-identity-language` @ `0b0d50d` |
| Production host | `mateyou-ecs` (`/root/mateyou`) |
| Merge | **Not merged.** |
| Deploy | **Not deployed.** |

## Verdict

Isolation succeeded. The five reviewed GEO-FIX-01 corrections now exist as a git commit on `geo/fix-01-isolated`, patched onto confirmed production web sources rather than onto git HEAD `PartnerLandingLayout`.

The original workspace working tree was not overwritten, deleted, or committed.

---

## 1. Baseline identification

Production is **not** a git SHA. ECS `git rev-parse` after `safe.directory` reports:

```
f330be89a53bf79b3dee24a774122cd7b7aa9c74  2026-06-27  feat: 关于页功能区改为图片+文字并注册图片槽位
```

That commit is months behind the running rsync overlay. It was **not** used as the FIX-01 parent.

`origin/main` / local HEAD `0b0d50d` also is **not** the OEM/RFQ production source: git HEAD still has `PartnerLandingLayout` on `/partner/oem`, while live `https://www.longvon.com/partner/oem` is the long RFQ page.

**Confirmed production baseline:** on-disk SHA256 of `/root/mateyou/apps/web` files captured over SSH on 2026-11-02. Those files are the last web sources present on the host (G5 layout mtime 2026-10-30; RFQ ZH mtime 2026-10-17; RFQ EN mtime 2026-10-26).

No production file in the overlay set was guessed.

### Production hashes used as baseline

| Path | SHA256 | Notes |
|---|---|---|
| `apps/web/app/layout.tsx` | `ee2a8356…cb91d4e` | Has G5 `LeadAttributionCapture`; `html lang="zh-CN"`; MATEYOU default title |
| `apps/web/app/en/layout.tsx` | `b79bcb14…9be707` | Matches git HEAD; still mounts `HtmlLang` |
| `apps/web/lib/i18n-routes.ts` | `80fe66c1…ed80e5` | Matches git HEAD; no `oemRfqAlternates` |
| `apps/web/components/HtmlLang.tsx` | `1cd1f534…e65de` | Present on production |
| `apps/web/components/LeadAttributionCapture.tsx` | `56abca82…69682` | Byte-identical to local untracked file |
| `apps/web/lib/lead-attribution.ts` | `a96d88a6…c2ed9838` | G5 helper already on production |
| `apps/web/app/partner/oem/page.tsx` | `f3836e2c…91f6e0d` | Production RFQ; canonical-only |
| `apps/web/app/en/partner/oem/page.tsx` | `5babf1d3…dbc937` | Production RFQ; `siteAlternates` x-default ZH |
| `apps/web/app/en/smart-ring-oem-odm/page.tsx` | `23f699aa…de958b` | Production NPI/trust body; no `OemEntityGraphSchema` |
| `apps/web/components/StructuredData.tsx` | `b68bca06…cc9514` | `knowsAbout` still lists ISO 13485 and NMPA |
| `apps/web/app/products/ring1c/page.tsx` | `429fc359…a69d` | Differs from git HEAD; title not yet absolute |
| `apps/web/components/OemRfqForm.tsx` | `70a9c1aa…c60c9c3` | Production RFQ form |
| `apps/web/components/EnTrustStrip.tsx` | `c8c5bdda…ee99f8` | Production EN trust strip |
| `apps/web/lib/geo-trust-en.ts` | `4b55c8ba…35746b34` | Production EN trust copy |
| `apps/web/components/GeoPageLayout.tsx` | `06cdd539…864e9f` | Compile dep of production OEM page |
| `apps/web/lib/geo.ts` | `244e25de…8eab43` | Compile dep |
| `apps/web/lib/geo-commercial.ts` | `4b34651f…8794bc` | Compile dep (`NPI_*` used by production EN OEM) |
| `apps/web/lib/partner-api.ts` | `2b7f5660…523b4b05` | Compile dep of production RFQ form |
| `apps/web/app/products/ring1c/SizeGuide.tsx` | `957ed171…9fc02e5` | Compile dep of production Ring1C |
| Title-only consumer/partner pages | match `0b0d50d` | Except Ring1C ZH, which used the production file above |
| `apps/web/middleware.ts` | **missing** | FIX-01 adds this |

Title-only pages whose production hash equals `0b0d50d` (knowledge, hospital, pharmacy, membership, about, news, metrics, authors, topics, `ArticleDetailView`) were patched on that shared baseline.

---

## 2. Isolation method

1. Created worktree `/Users/libingshi/Downloads/mateyou-geo-fix-01-isolated` from `0b0d50d` on new branch `geo/fix-01-isolated`. The Cursor workspace on `geo/fix-01-identity-language` was left dirty.
2. Copied the production files in §1 into that worktree and verified SHA256 match.
3. Commit 1 — production baseline restore (not a GEO fix):
   - `d5eb8c9` `chore(geo): snapshot production web sources as GEO-FIX-01 isolation baseline`
4. Applied **only** the five reviewed FIX-01 hunks on top of that baseline.
5. Independent tests + `next build` + local SSR curls (below).
6. Commit 2 — FIX-01 only vs `d5eb8c9`.

### What “strip LeadAttributionCapture” means here

Review §5 said to drop `LeadAttributionCapture` from a commit based on git HEAD. That would delete G5 from production `layout.tsx` on a later web rsync.

This isolation follows the later instruction: strip capture from the **FIX-01 delta**, keep it in the file because it is already production.

- Baseline commit restores production `LeadAttributionCapture` + `lead-attribution.ts`.
- FIX-01 commit on `layout.tsx` only adds `headers()`, SSR `html lang`, and LONGVON default metadata. The capture import/render is unchanged vs production.

---

## 3. FIX-01 commit contents vs production baseline

Allow-list after surgery (diff `d5eb8c9..HEAD` of this isolation):

**New**

- `apps/web/middleware.ts`
- `apps/web/app/assessment/layout.tsx`
- `apps/web/app/dashboard/layout.tsx`
- `apps/web/lib/i18n-routes.spec.mjs`
- `docs/geo/GEO-FIX-01-REPORT.md`
- `docs/geo/GEO-FIX-01-REVIEW.md`
- `docs/geo/GEO-FIX-01-ISOLATION-REPORT.md`

**Patched**

- `apps/web/app/layout.tsx` — lang + LONGVON titles; G5 capture kept
- `apps/web/app/en/layout.tsx` — `HtmlLang` removed
- `apps/web/lib/i18n-routes.ts` — `htmlLangFromPathname`, `oemRfqAlternates`
- `apps/web/components/StructuredData.tsx` — no ISO/NMPA in `knowsAbout`; locale-aware service node; `OemEntityGraphSchema`; production `sameAs` company URL kept
- RFQ ZH/EN pages — `oemRfqAlternates` only; RFQ bodies are production
- `apps/web/app/en/smart-ring-oem-odm/page.tsx` — `OemEntityGraphSchema` mount only; NPI body is production
- Title-absolute pages listed in the implementation report, including production Ring1C ZH
- `apps/web/components/ArticleDetailView.tsx`
- `scripts/geo/verify-site-url.mjs`

**Deleted**

- `apps/web/components/HtmlLang.tsx`

### Explicitly excluded

API, Prisma, nginx, env examples, G1/G5/G6 ops docs, deleted GEO archives, `CompanyTrustEvidence.tsx`, `next.config.ts`, `sitemap.ts`, Hero/Qualification/SizeGuide extras from the scratch tree, and any other dirty-workspace path.

---

## 4. Independent verification

Run in the isolated worktree, not in the scratch working tree.

| Check | Result |
|---|---|
| `node --experimental-strip-types --test apps/web/lib/i18n-routes.spec.mjs` | **4/4 pass** |
| `node --test scripts/geo/verify-site-url.mjs` | **17/17 pass** (includes four GEO-FIX-01 assertions) |
| `NEXT_PUBLIC_SITE_URL=https://www.longvon.com npm run build --workspace=apps/web` | **pass** — compiled, typed; middleware 33.8 kB |
| Local `next start` SSR 127.0.0.1:3011 | **pass** for routes below |

### Local SSR (isolated build, not production)

| URL | `html lang` | Title / notes |
|---|---|---|
| `/en` | `en` | `LONGVON \| Smart Ring Manufacturer & OEM/ODM Provider` |
| `/en/partner/oem` | `en` | RFQ title; hreflang zh-CN/en; **x-default → EN RFQ** |
| `/partner/oem` | `zh-CN` | Reciprocal same language set; **x-default → EN RFQ** |
| `/en/smart-ring-oem-odm` | `en` | `/#organization` and `/#service-oem-odm` present; `knowsAbout` has no ISO 13485 / NMPA |
| `/about` | `zh-CN` | `关于龙汾科技 \| LONGVON` (single suffix) |
| `/products/ring1c` | `zh-CN` | `MATEYOU Ring1C 智能戒指 \| LONGVON 参考产品` |
| `/knowledge`, `/partner/articles` | 500 | Local API not running. **Not production.** Live those routes are 200. Title-absolute is unit-tested in source. |

---

## 5. G5 production attribution

| Check | Result |
|---|---|
| Production `layout.tsx` already imports and renders `LeadAttributionCapture` | Confirmed (`ee2a8356…`) |
| Isolated FIX-01 `layout.tsx` still imports and renders it | Confirmed |
| `LeadAttributionCapture.tsx` / `lead-attribution.ts` hashes | Unchanged vs production |
| This work did not rsync, restart pm2, or alter ECS | Confirmed |

A future web deploy of **only** the FIX-01 commit on top of the production baseline will keep G5. A deploy that replaced production `layout.tsx` with git HEAD + lang and **without** capture would remove G5; that shape was not committed.

---

## 6. Scratch workspace

`/Users/libingshi/Downloads/mateyou-platform` remains:

```
geo/fix-01-identity-language  0b0d50d
unique commits vs origin/main: 0
working tree: still dirty / untracked (API, Prisma, nginx, GEO archives, mixed FIX-01)
```

No files there were reverted, deleted, or committed as part of isolation.

---

## 7. What was not done

- No merge to `main`.
- No deploy, rsync, or pm2 restart.
- No CSDN auto-publish, Qwen work, historical backfill, or syndication migrate.
- Production live HTML still has the five audit defects until an isolated web deploy is approved.

---

## 8. How to review / later deploy

```
git -C /Users/libingshi/Downloads/mateyou-geo-fix-01-isolated log --oneline origin/main..HEAD
git -C /Users/libingshi/Downloads/mateyou-geo-fix-01-isolated show --stat HEAD
```

1. Review commit 1 as production catch-up required so OEM/RFQ/G5 compile.
2. Review commit 2 as the five GEO fixes.
3. If deploying later: web-only rsync of the isolated tree’s `apps/web` output, with Next middleware actually executing. Do not deploy the scratch `geo/fix-01-identity-language` working tree.
4. After deploy, smoke-curl live `/en`, `/en/partner/oem`, `/partner/oem`, `/en/smart-ring-oem-odm`, `/knowledge`.
