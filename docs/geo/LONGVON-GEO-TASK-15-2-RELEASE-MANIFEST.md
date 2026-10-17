# LONGVON GEO Task #15.2 — Final Release Manifest

**Date:** 2026-10-17  
**Based on:** Task #15 P0 Fix Report · Task #15.1 Pre-Deploy Review  
**Mode:** Manifest only — **do not deploy / commit / push / reset / clean / stash / modify app source**  
**Git snapshot:** `docs/geo/_task15_2_git-snapshot.txt`  
**Branch / HEAD:** `main` @ `d868a186e6ff6c7b26c7fe6e796ac1097d12355c`

---

## 1. Current Git status (targets)

| Path | Status |
|------|--------|
| `apps/web/lib/resolve-site-url.ts` | **Untracked (new)** |
| `scripts/geo/verify-site-url.mjs` | **Untracked (new)** |
| `apps/web/lib/site.ts` | Modified |
| `apps/web/app/layout.tsx` | Modified |
| `apps/web/components/StructuredData.tsx` | Modified (large) |
| `apps/web/app/products/ring1c/page.tsx` | Modified (large) |
| `apps/web/app/en/products/ring1c/page.tsx` | Modified (large) |
| `.env.example` | Modified (mixed) |
| `.env.production.example` | Modified (mixed) |
| `apps/web/app/robots.ts` / `sitemap.ts` | **Clean** (already call `getSiteUrl()`) |

Workspace remains dirty with many **non-Task-15** GEO/OEM/API files — **exclude from this release**.

---

## 2. Release options

### M1 — Production URL configuration only

**Goal:** Stop localhost leaking into robots / sitemap / canonical / hreflang / `metadataBase` after rebuild.

| # | Path | Action |
|---|------|--------|
| 1 | `apps/web/lib/resolve-site-url.ts` | **ADD** (new) |
| 2 | `apps/web/lib/site.ts` | **REPLACE** with working-tree version |
| 3 | `apps/web/app/layout.tsx` | **REPLACE** with working-tree version |

Optional (docs only, not required for runtime):

| # | Path | Note |
|---|------|------|
| — | `.env.production.example` | Prefer **manual edit** of SITE_URL comment only — full file is mixed |
| — | `.env.example` | Same — mixed; do not wholesale-copy |
| — | `scripts/geo/verify-site-url.mjs` | Useful on CI/laptop; not needed on ECS runtime |

**Not in M1:** `StructuredData.tsx`, Ring1C ZH/EN pages.

---

### M2 — URL + structured data + ZH/EN Ring1C (Task #15 complete)

**Goal:** M1 + FAQ visible/schema consistency + remove Offer/sku/mpn/App free price + company entity links + Ring1C GEO page content currently in those files.

| # | Path | Action |
|---|------|--------|
| 1–3 | Same as M1 | Required |
| 4 | `apps/web/components/StructuredData.tsx` | **REPLACE** entire working-tree file |
| 5 | `apps/web/app/products/ring1c/page.tsx` | **REPLACE** entire working-tree file |
| 6 | `apps/web/app/en/products/ring1c/page.tsx` | **REPLACE** entire working-tree file |
| 7 | `scripts/geo/verify-site-url.mjs` | **ADD** (recommended) |

Optional env example comments: same caution as M1.

**Still exclude:** API syndication, other GEO pages, nginx, prisma, docs `_task*`, etc.

---

## 3. Mixed-file annotation (cannot safely auto-split)

**Verdict:** For `StructuredData.tsx` and both Ring1C pages, Task #15 hunks are **interleaved** with prior uncommitted GEO rewrites in the same files. **Do not assume `git add -p` can safely isolate Task #15 only** without a careful human review session. Shipping M2 means accepting **full current file contents** as one unit.

| File | Must-include (Task #15 / P0) | Pre-existing uncommitted GEO (shipped if file is whole-replaced) | Split? |
|------|------------------------------|-------------------------------------------------------------------|--------|
| `resolve-site-url.ts` | Entire file | — | N/A (new, pure A) |
| `site.ts` | Entire small diff | — | Safe as whole file |
| `layout.tsx` | `getSiteUrl()` → `metadataBase` | — | Safe as whole file |
| `StructuredData.tsx` | `getSiteUrl()` origin; remove sku/mpn/Offer/App `price:0`; FAQ constants used by pages | Entity `@graph`, OEM Service, variants, Site/Ring1C graph APIs | **UNSAFE to auto-split** — ship whole or leave out (M1) |
| `products/ring1c/page.tsx` | `/company/longvon` link; visible `RING1C_FAQS_ZH.map` | H1 + 三 H2 GEO structure, metrics, craft, SizeGuide integration | **UNSAFE to auto-split** |
| `en/products/ring1c/page.tsx` | About LONGVON links; `RING1C_FAQS_EN.map` | EN Use cases / Core specs / Category comparison | **UNSAFE to auto-split** |
| `.env*.example` | SITE_URL comment clarity | Syndication / other keys | **Do not wholesale-ship**; edit SITE_URL lines manually if needed |

**Risk if M2 ships whole Ring1C/StructuredData:** production visual/content jumps to full GEO product page (intended by earlier GEO work), not only a surgical FAQ/link patch. Accept that, or stay on **M1**.

---

## 4. Human release commands (**DO NOT RUN in this agent task**)

> Copy for the human operator. Paths assume repo root on the build host. Adjust remote/PM2 names to match ECS.

### 4.1 Prepare a clean release tree (recommended pattern)

Avoids polluting/committing the dirty laptop workspace:

```bash
# On build machine or a throwaway worktree — DO NOT git clean the dirty main workspace
cd /path/to/mateyou-platform
git fetch origin   # if applicable
git worktree add /tmp/longvon-release-15 main

# Copy ONLY chosen files from the dirty workspace into the worktree
DIRTY=/path/to/mateyou-platform   # current dirty checkout
WT=/tmp/longvon-release-15

# --- M1 ---
cp "$DIRTY/apps/web/lib/resolve-site-url.ts" "$WT/apps/web/lib/"
cp "$DIRTY/apps/web/lib/site.ts" "$WT/apps/web/lib/"
cp "$DIRTY/apps/web/app/layout.tsx" "$WT/apps/web/app/"

# --- M2 extra (skip for M1) ---
# cp "$DIRTY/apps/web/components/StructuredData.tsx" "$WT/apps/web/components/"
# cp "$DIRTY/apps/web/app/products/ring1c/page.tsx" "$WT/apps/web/app/products/ring1c/"
# cp "$DIRTY/apps/web/app/en/products/ring1c/page.tsx" "$WT/apps/web/app/en/products/ring1c/"
# mkdir -p "$WT/scripts/geo" && cp "$DIRTY/scripts/geo/verify-site-url.mjs" "$WT/scripts/geo/"
```

### 4.2 Mandatory production build env

```bash
export NEXT_PUBLIC_SITE_URL=https://www.longvon.com
# Build web only (or full monorepo if that is your standard)
cd /tmp/longvon-release-15
NEXT_PUBLIC_SITE_URL=https://www.longvon.com npm run build --workspace=apps/web
```

**Critical:** `NEXT_PUBLIC_*` is inlined at **build** time. Setting it only at `pm2 restart` without rebuild will **not** fix baked localhost.

### 4.3 Deploy artifact / restart (example — adapt to your ECS script)

```bash
# Example only — use your existing deploy path / rsync / pm2 ecosystem
# rsync -az --delete apps/web/.next/ user@ecs:/var/www/mateyou/apps/web/.next/
# rsync apps/web/lib/resolve-site-url.ts apps/web/lib/site.ts ...
# pm2 restart mateyou-web --update-env
```

Confirm `ecosystem.config.js` (or env file) contains:

```bash
NEXT_PUBLIC_SITE_URL=https://www.longvon.com
```

### 4.4 Optional pre-deploy checks on build host

```bash
node --test scripts/geo/verify-site-url.mjs
# Inspect baked SEO (after build):
grep -E 'Host:|Sitemap:' apps/web/.next/server/app/robots.txt.body
head -40 apps/web/.next/server/app/sitemap.xml.body
```

---

## 5. Post-deploy verification commands

```bash
# robots — must NOT contain localhost
curl -sS https://www.longvon.com/robots.txt | grep -E 'Host:|Sitemap:'
# expect:
# Host: https://www.longvon.com
# Sitemap: https://www.longvon.com/sitemap.xml

# sitemap — zero localhost
curl -sS https://www.longvon.com/sitemap.xml | grep -c localhost || true
# expect: 0
curl -sS https://www.longvon.com/sitemap.xml | grep -o '<loc>[^<]*</loc>' | head -20
# expect: https://www.longvon.com/...

# EN canonical + hreflang
curl -sS https://www.longvon.com/en/products/ring1c | tr '>' '>\n' | grep -E 'rel="canonical"|hreflang|hrefLang'
# expect absolute https://www.longvon.com/... pairs; no localhost

# ZH product (dynamic page — still check server HTML)
curl -sS https://www.longvon.com/products/ring1c | tr '>' '>\n' | grep -E 'rel="canonical"|hreflang|hrefLang' | head
curl -sS https://www.longvon.com/products/ring1c | grep -o '<h1[^>]*>.*</h1>' | head
# M2 expect H1 containing MATEYOU Ring1C; M1 may still be old marketing H1

# JSON-LD parse smoke (EN static-friendly)
curl -sS https://www.longvon.com/en/products/ring1c | python3 -c "
import sys,re,json
h=sys.stdin.read()
blocks=[]
for m in re.finditer(r'<script[^>]*ld\+json[^>]*>(.*?)</script>', h, re.I|s):
  blocks.append(json.loads(m.group(1)))
print('blocks', len(blocks))
assert 'localhost' not in h
assert 'InStock' not in h
assert 'MATEYOU-RING1C' not in h
print('OK')
"

# M2-only: company link + FAQ visible
# curl -sS https://www.longvon.com/products/ring1c | grep -F '/company/longvon'
# curl -sS https://www.longvon.com/products/ring1c | grep -F '常见问题'
```

---

## 6. Rollback (without wiping other uncommitted work)

**Principle:** Roll back **deployed server artifacts / process**, not `git reset` on the dirty laptop workspace.

### 6.1 Server-side rollback

```bash
# Restore previous release directory / previous .next tarball from your backup
# Example pattern:
# pm2 stop mateyou-web
# mv /var/www/mateyou/apps/web/.next /var/www/mateyou/apps/web/.next.bad-15
# mv /var/www/mateyou/apps/web/.next.prev /var/www/mateyou/apps/web/.next
# pm2 start mateyou-web
```

Keep a **pre-deploy `.next` (and copied source files) backup** before overwriting.

### 6.2 Do **not** on the dirty developer clone

```bash
# FORBIDDEN for rollback of this release:
# git reset --hard
# git clean -fd
# git checkout -- .
# git stash -u
```

Those would destroy unrelated GEO/OEM uncommitted work.

### 6.3 If release was copied via worktree only

Delete the worktree; leave the dirty `main` working tree untouched:

```bash
git worktree remove /tmp/longvon-release-15
```

---

## 7. Deploy-before checklist

- [ ] Chosen **M1** or **M2** explicitly  
- [ ] Mixed files reviewed if M2 (accept full file replace)  
- [ ] Non-Task-15 dirty files **excluded**  
- [ ] Pre-deploy backup of current prod `.next` (+ current Ring1C/StructuredData if M2)  
- [ ] `NEXT_PUBLIC_SITE_URL=https://www.longvon.com` set for **build**  
- [ ] Local/CI `next build` with that env succeeded (Task #15.1 already did)  
- [ ] Operator has post-deploy curl script ready  

---

## 8. Final recommendation

| Item | Value |
|------|--------|
| **Recommended option** | **M2** — completes Task #15 acceptance goals; M1 only if you need an emergency URL hotfix today |
| **Exact file list (M2)** | `apps/web/lib/resolve-site-url.ts` (add), `apps/web/lib/site.ts`, `apps/web/app/layout.tsx`, `apps/web/components/StructuredData.tsx`, `apps/web/app/products/ring1c/page.tsx`, `apps/web/app/en/products/ring1c/page.tsx`, `scripts/geo/verify-site-url.mjs` (add, optional on server) |
| **Exact file list (M1)** | `resolve-site-url.ts`, `site.ts`, `layout.tsx` only |
| **Mixed-mod risk** | StructuredData + Ring1C ZH/EN = **cannot safely auto-split**; shipping M2 = full current files |
| **Pre-deploy** | Backup prod; build with `NEXT_PUBLIC_SITE_URL=https://www.longvon.com`; exclude dirty-tree noise |
| **Post-deploy** | robots Host/Sitemap; sitemap locs; EN/ZH canonical+hreflang; JSON-LD smoke (no localhost / InStock / fake sku) |
| **Rollback** | Restore previous server `.next` (and file copies); **never** hard-reset the dirty workspace |

---

**STOP.** Await human approval. This agent must not deploy, commit, push, or roll back.
