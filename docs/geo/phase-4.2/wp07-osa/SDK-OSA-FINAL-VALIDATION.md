# SDK + OSA Final Validation — WP07-FINAL-001-B

**UTC test window:** 2026-11-13T07:57:23Z (build) · 2026-11-13T07:58:10Z (SSR/i18n)  
**Evidence file:** `evidence/ssr-smoke-wp07-final-001.txt`  
**hreflang script:** fixed to parse `hrefLang` case-insensitively (prior false-negative corrected).

## Four pages

| Page | SSR | lang | Canonical | hreflang zh/en/x-default | Meta | Disclaimer | Ring1C≠MD | Notes |
|---|---|---|---|---|---|---|---|---|
| `/en/osa-smart-ring-technology` | 200 | en | OK | OK | OK | EN aside present | OK | AHI≠PSG; non-diagnostic; no STOP-BANG |
| `/osa-smart-ring-technology` | 200 | zh-CN | OK | OK | OK | **New ZH wording present**; old phrase absent | OK | Same boundaries |
| `/en/smart-ring-sdk-api` | 200 | en | OK | OK | OK | N/A (SDK boundaries section) | OK | 100Hz + cloud dependency present; OSA link present |
| `/smart-ring-sdk-api` | 200 | zh-CN | OK | OK | OK | N/A | OK | 100Hz + cloud; OSA link present |

Sitemap `/sitemap.xml` SSR 200 contains both `osa-smart-ring-technology` and `smart-ring-sdk-api`.

## Conversion paths (link present **and** target SSR 200)

| Path | Source → Target URL | Result |
|---|---|---|
| OSA EN → SDK | `/en/osa-smart-ring-technology` → `/en/smart-ring-sdk-api` | **PASS** |
| SDK EN → OSA | `/en/smart-ring-sdk-api` → `/en/osa-smart-ring-technology` | **PASS** |
| OSA EN → OEM/ODM | → `/en/smart-ring-oem-odm` | **PASS** |
| OSA EN → Partner OEM CTA | → `/en/partner/oem` | **PASS** |
| SDK EN → OEM/ODM | → `/en/smart-ring-oem-odm` | **PASS** |
| SDK EN → Partner OEM CTA | → `/en/partner/oem` | **PASS** |
| OSA ZH → SDK | `/osa-smart-ring-technology` → `/smart-ring-sdk-api` | **PASS** |
| SDK ZH → OSA | `/smart-ring-sdk-api` → `/osa-smart-ring-technology` | **PASS** |
| OSA ZH → OEM/ODM | → `/smart-ring-oem-odm` | **PASS** |
| OSA ZH → Partner OEM | → `/partner/oem` | **PASS** |
| SDK ZH → OEM/ODM | → `/smart-ring-oem-odm` | **PASS** |
| SDK ZH → Partner OEM | → `/partner/oem` | **PASS** |

## i18n
`node --experimental-strip-types --test apps/web/lib/i18n-routes.spec.mjs` → **5 pass / 0 fail** (UTC 07:58:10Z).

## Verdict
**PASS** for four-page final validation and conversion chain on local standalone SSR. Production still **not** live / not authorized.
