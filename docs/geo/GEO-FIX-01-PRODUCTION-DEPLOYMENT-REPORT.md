# GEO-FIX-01 Production Deployment Report

## Final status

# DEPLOYED — ALL CHECKS PASSED

**Authorization:** User written approval for `GEO-FIX-01 Phase 3.0.0 Option B Production Deployment`  
**Package:** `GEO-FIX-01-PHASE-3` / `3.0.0`  
**Frozen payload commit:** `8e41fd4c6cf8f934ded7b8b87ddebc35a61e1ecf`  
**Frozen manifest SHA256:** `bc13b55c7163068edc2e7a00ac6dd8a49625f67127c8aa06a726bc7be7af688f`  
**Host:** `mateyou-ecs` / `/root/mateyou`  
**Deploy start (UTC):** `2026-11-08T15:04:56Z`  
**Deploy end (UTC):** `2026-11-08T15:07:21Z`  
**Build ID:** `dORiARwI1hD7uxf-T7e_K`  

This report records **actual production execution**, not a simulation.

## 1. Pre-deploy gates (all passed)

| Gate | Result |
|---|---|
| Manifest / payload SHA256 | PASS (`bc13b55c…`; payload hashes match) |
| 31-file matrix vs manifest | PASS |
| Live production hashes vs predeploy pins | PASS (0 conflict; 28 present + 3 ADD absent) |
| Backup dir + tarball SHA256 | PASS (`ce52d796…` inventory; `567e42c6…` tarball) |
| Approval pack / rollback checklist present | PASS |
| Dry-run COPY 30 / DELETE 1 | PASS |

## 2. Commands executed (summary)

1. Stage package to `/tmp/geo-fix01-optionb-stage` (manifest + payload + whitelist copy helper only).  
2. Record pre-hashes → `/tmp/fix01-pre-hashes.json`.  
3. `node scripts/geo/copy-fix-01-whitelist.mjs --repo $STAGE --target /root/mateyou --execute --i-understand-this-writes-files`  
   → `OK execute copied=30 deleted=1`.  
4. Post-copy verify: 31/31 OK; denylist unchanged; `LeadAttributionCapture` retained in `layout.tsx`.  
5. Standalone bak: `/root/mateyou/_rollback/web-standalone.bak.geo-fix01-pre-20261108T150456Z`.  
6. `NEXT_PUBLIC_SITE_URL=https://www.longvon.com npm run build --workspace=apps/web` (exit 0).  
7. Copy `.next/static` (+ public) into standalone web root.  
8. `pm2 restart mateyou-web --update-env` → online.  

**Not executed:** nginx reload/edit; DB migration; Gemini API; merge; G5/OEM form file changes; `next.config.ts` changes; dirty local workspace cleanup.

## 3. File inventory — before / after

| Path | Action | Pre SHA256 / state | Post SHA256 / state | Match candidate |
|---|---|---|---|---|
| `apps/web/middleware.ts` | ADD | `ABSENT` | `384f53cf5239e088907bccb2918c983a6a548c525701e6ea107735368035d949` | YES |
| `apps/web/app/assessment/layout.tsx` | ADD | `ABSENT` | `d3a4c4ad2be8711c511876e10042c322933255f6bd2e4ea1c3d010a137c6bbe5` | YES |
| `apps/web/app/dashboard/layout.tsx` | ADD | `ABSENT` | `c6be9544f5b757338bf78667ccfb8e3b8f2cd6002fb15e72017124c770710c23` | YES |
| `apps/web/app/about/page.tsx` | REPLACE | `86e2960f6c2ff05858a519d850d7c0b67bc3dc4a6b709d8268d6d0b00da4510d` | `c6edb5f814201e201cb199a7287db42071c718841545f7a3546c4c3497af24df` | YES |
| `apps/web/app/assessment/page.tsx` | REPLACE | `671f0abb16d55d55d201cf1a65d79714fd294bbccda69653acc17131d493da09` | `7ee962aa30e40cbcedbc093212b2893627793066232fed285379461b3c7beb97` | YES |
| `apps/web/app/authors/[id]/page.tsx` | REPLACE | `51ba36d7ba83e83b7ec7f4bd4c45d35ec67ae3ee5d7e0bb46545846571bfb7f1` | `06b6e839404e9c34ab0149f0f154dabe358b7340ecf08943e7d1881bcee0b340` | YES |
| `apps/web/app/en/layout.tsx` | REPLACE | `b79bcb149f1ba0a43037869a13c2554e603217baf74c57dfe4453006cf9be707` | `17bb0676eb7f1e6f00b7cf8696613f53cce6cece59d0d4c23722ed58d2fc9f5d` | YES |
| `apps/web/app/en/partner/oem/page.tsx` | REPLACE | `5babf1d3d2b6d97ddd83a9c8aa035d87867f17de6bc561d0d7494e85f8dbc937` | `c6882b5233fd9bd7e779de2ed672cd60791f0ed061d684c26684a2d91bb05caf` | YES |
| `apps/web/app/en/smart-ring-oem-odm/page.tsx` | REPLACE | `23f699aa45dd2dfcba9f01b3e5de6197c36abfb3cf48bd5a77c18ecd77de958b` | `2ae508e8b213dc0181624482deed2fa4e660952441c67668a38832f874dfc1f4` | YES |
| `apps/web/app/knowledge/[slug]/page.tsx` | REPLACE | `aeb130e8960e758c4828e55e322430240cf2ad559bae363cc8c0dd58597267a8` | `65985dfe3a64e3f8820eb1b5cd7aaf6730a20aa10ce837a0a4babc554413c172` | YES |
| `apps/web/app/knowledge/page.tsx` | REPLACE | `6859a2d18a77bd0e0bc48baa3426e89e648abd5d64f13694f265e58310778af0` | `3c0c99a10c06901cfe3c75b6c6680ee2eef80f140633b8b1ad6caa7911efbfed` | YES |
| `apps/web/app/layout.tsx` | REPLACE | `ee2a8356d2723c6a22a326ac0be84f7efd20d501d9ca5a45484fa68dfcb91d4e` | `d2add71a289f076f5c1145ff4311fadf73034c71f164a71fa2d1083c0d3d2c55` | YES |
| `apps/web/app/membership/page.tsx` | REPLACE | `7debdd66d58e06fa950ddd3537265f973e4ee69de291f5c3675f0d7aea60b160` | `af6e80b7d8f9fef41725f376148c4552949a3ba42638b8bc8559758610ddd82d` | YES |
| `apps/web/app/metrics/[slug]/page.tsx` | REPLACE | `9ff4ef6def02c9de7d8e6835a6b9c5af9ef96ed2acb2cd7e260bd470db492dac` | `617431e403307917a5270880ff91eb012d9465e80aa8f6a949e4273cf0a7307e` | YES |
| `apps/web/app/metrics/page.tsx` | REPLACE | `a05647e66faec87847dd59ed0880838c1380ca60cde7fb50bf8bff2fda5576a3` | `84c7ca9927b2ff3ff2e96660349e907210288a6d52c38d7ed5c3a40f9a39c4c7` | YES |
| `apps/web/app/news/[slug]/page.tsx` | REPLACE | `01b1691a0d765eef0710717b0856d8f7edd0750f9e7352b082e682f7d0ba2a9e` | `c1bef5b06d442509216694d7657ecbd7d92c236672a586fb374f6e653163021e` | YES |
| `apps/web/app/news/page.tsx` | REPLACE | `fa0b16635bb4695688dee4439a17024a1ca5be4866e7d939fa6df15edde9e09c` | `6478ef09215bf17968830367a9bd30140dd01e2bd58fbb569750efded765b6b9` | YES |
| `apps/web/app/partner/articles/page.tsx` | REPLACE | `79d8f9c4fc4144d023edc74e2791bc99bbfd47bcb6b1aabff208a17f5cb8a785` | `3b07c018c6dbb172f1095dbaeb89bf32ebae03676e01de43e35364e39007e66c` | YES |
| `apps/web/app/partner/distributor/page.tsx` | REPLACE | `21c2e55781f25906b80a4f6abc7455bed15f345420d5de798252ef345b248aca` | `f7b29320afa444e0e69a7b39cd696549d0d0c299dd543e57a5c1f2586c8edc03` | YES |
| `apps/web/app/partner/enterprise/page.tsx` | REPLACE | `f0b84358a919e13170dc1a7f5aad21aa5294d64dd30b68870e6cbc1df5fca4c3` | `ea38342e3cf81493dfa429b0533d759776282968dc0cd17617a937625309bdb9` | YES |
| `apps/web/app/partner/hospital/page.tsx` | REPLACE | `f98a5b4331dbdff4e67a6aea475723f3692b38de87272d7222f514cbb67b4b99` | `1c609d01a10c6dc71e43fb0d58d681f73239d568d3d1aaa10418decb1454f16b` | YES |
| `apps/web/app/partner/oem/page.tsx` | REPLACE | `f3836e2c6e29bb47c4a0c4cff8a8dd3a69ee40417032691001697f30c91f6e0d` | `7a7917d9a91bf9982fb62e9303aba79ca71923f9cabb8941cba2c8688c5aecea` | YES |
| `apps/web/app/partner/page.tsx` | REPLACE | `68341a744091dbdc401ca6820c6819d4efe1521a172f4328554e4a24411bf74b` | `79b228f5b93defea3acee1c0daa44f0a30bcdf4d4b51d61e50dcef8054ce276a` | YES |
| `apps/web/app/partner/pharmacy/page.tsx` | REPLACE | `d2f0b859141986a970280e6fb3bb53c57ba7400782d1e7d5270c0d4cc7e7cc82` | `cfb18e339fd5fa7adf8db7ac90e56561039ac373dda306d18ae88d7bdaa4e592` | YES |
| `apps/web/app/products/ring1c/page.tsx` | REPLACE | `429fc359dc87e044a759f014b6afd64f8a18d31293b14d50d59e78581361a69d` | `b403f05c8b6688c86edfbe59a05c92bcdb20ec871cd22d34bed549f79f5dc82b` | YES |
| `apps/web/app/topics/[slug]/page.tsx` | REPLACE | `36b1d43897e50be7a494efe91069030cd49b8bbbba05104f5ba9e7540d1ebd2d` | `15d6f9f938a69d4cea5fe648c6e090838df7a32552da238c9c4460b31dca0215` | YES |
| `apps/web/components/ArticleDetailView.tsx` | REPLACE | `d5470396ae00ec7fa035cda9ab6d6d8011256b3a437e9946923e0b8df3144c9a` | `52fbe64868f7973047c5ef5193c6f24f3e71fb1707fb31bc6608d55cbb22514a` | YES |
| `apps/web/components/StructuredData.tsx` | REPLACE | `b68bca062abb2698ffdb9616f7d1929226ba49193b3b0f00b68e0ec6c6cc9514` | `8a6dbb658b395970dc6fefaae2569c51e4490b104039f4458553d89f82853109` | YES |
| `apps/web/lib/i18n-routes.ts` | REPLACE | `80fe66c184fc78783120bd4e71910c15ee1ca9b14536f4bbb879a0fc4fed80e5` | `5e9242e5cc0b5248ce07f78f9c1a261f30bc4c1f27099439bedfa337b12ef0ac` | YES |
| `apps/web/components/HtmlLang.tsx` | DELETE | `1cd1f534caeae8dd2b1cafd8d2736d1461401866aa8d1511221f2f082c6e65de` | `ABSENT` | YES |
| `apps/web/app/en/smart-ring-manufacturer/page.tsx` | REPLACE | `726cc0b872e050f62e47451c7580768a29a2eafed6413ce23ac9e8391e4ed7b7` | `2912e2b5965c06dcbb8544c6494e60847bc01a22dfaf43bff54ae8db5a715bca` | YES |

Protected denylist post-deploy (unchanged):

| File | Unchanged |
|---|---|
| `apps/web/next.config.ts` | YES |
| `apps/web/components/OemRfqForm.tsx` | YES |
| `apps/web/lib/partner-api.ts` | YES |
| `apps/web/components/LeadAttributionCapture.tsx` | YES |
| `apps/web/lib/lead-attribution.ts` | YES |

`HtmlLang.tsx`: DELETED on production (present in Option B source backup for rollback).

## 4. Service status

| Service | Status |
|---|---|
| `mateyou-web` (PM2) | online after restart |
| `mateyou-api` (PM2) | online (untouched) |
| nginx Contact 301 | unchanged / still active |

Deploy log on server: `/root/mateyou/_rollback/geo-fix-01-deploy-20261108T.log`

## 5. Post-deploy acceptance (live evidence)

Fetched from `https://www.longvon.com` after restart:

| Check | Result | Detail |
|---|---|---|
| home_lang | PASS | zh-CN |
| manu_lang | PASS | en |
| manu_meta | PASS | [145, 'LONGVON is a smart ring manufacturer offering OEM/ODM, custom hardware, firmware, health algorithms, apps, SDK/API integration and manufacturing.'] |
| oem_lang | PASS | en |
| oem_meta | PASS | [152, 'Develop custom smart rings with LONGVON. We provide OEM/ODM hardware, firmware, health algorithms, apps, SDK/API integration, testing and manufacturing.'] |
| oem_hreflang | PASS | ['zh-CN', 'en', 'x-default'] |
| oem_xdefault_en | PASS | ['zh-CN', 'en', 'x-default'] |
| manu_hreflang | PASS | ['zh-CN', 'en', 'x-default'] |
| jsonld | PASS | [6, 4] |
| contact_301 | PASS | HTTP/1.1 301 Moved Permanently |

Additional verified:
- Homepage HTTP 200  
- Manufacturer / OEM HTTP 200  
- OEM form markup present  
- G5 `LeadAttributionCapture` still imported/rendered in production `layout.tsx`  
- JSON-LD blocks present (OEM 6, Manufacturer 4)  
- OEM `x-default` → `https://www.longvon.com/en/partner/oem`  

## 6. Exceptions / notes

| Item | Classification |
|---|---|
| PM2 error log contains historical `Failed to find Server Action` lines | **Pre-existing** (log mtime `2026-11-08 22:49 +0800`, before deploy window `23:04–23:07`). Not treated as FIX-01 regression. |
| Initial hreflang regex missed React `hrefLang` attribute casing | Probe false negative only; live HTML contains `zh-CN` / `en` / `x-default`. Corrected check PASS. |
| Rollback | **Not triggered** |

## 7. Rollback readiness (unused)

Source backup remains:
- `/root/mateyou/_rollback/geo-fix-01-optionb-src.20261108T143100Z`
- tarball SHA256 `567e42c62e4946afa73b7dccdebf42b325d3da1793f6129ccc18844f239f52b9`
- Pre-deploy standalone bak: `/root/mateyou/_rollback/web-standalone.bak.geo-fix01-pre-20261108T150456Z`
- Checklist: `GEO-FIX-01-ROLLBACK-AND-POST-DEPLOY-CHECKLIST.md`

## 8. Final status line

`DEPLOYED — ALL CHECKS PASSED`
