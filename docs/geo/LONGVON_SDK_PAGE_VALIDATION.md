# LONGVON_SDK_PAGE_VALIDATION.md

Task: P42-R2-002 · 2026-11-10T13:07:28Z

## Implementation
| Item | Result |
|---|---|
| Route `/en/smart-ring-sdk-api` | **Created** `apps/web/app/en/smart-ring-sdk-api/page.tsx` |
| Route `/smart-ring-sdk-api` | **Created** ZH counterpart |
| `GEO_PAGE_SLUGS` / sitemap | Includes `smart-ring-sdk-api` |
| robots allow | Added ZH+EN paths |
| Footer / EN nav | Linked |
| Technology pages | Link + cloud-boundary wording |

## Local validation (not production)
Build: `NEXT_PUBLIC_SITE_URL=https://www.longvon.com npm run build --workspace=apps/web` → **PASS**  
SSR smoke (standalone :3260):

| Path | HTTP | lang | canonical |
|---|---|---|---|
| `/en/smart-ring-sdk-api` | 200 | en | `https://www.longvon.com/en/smart-ring-sdk-api` |
| `/smart-ring-sdk-api` | 200 | zh-CN | `https://www.longvon.com/smart-ring-sdk-api` |

Evidence: `docs/geo/phase-4.2/round-2/evidence/sdk/p42-r2-sdk-ssr.json`

## Boundaries included on page
- 100Hz PPG for qualified partners
- Cloud algorithm dependency disclosed
- Customer-owned App = project evaluation
- No unrestricted Bluetooth promise
- No all-algorithms-offline promise
- Ring1C not medical device

## Production
**Not deployed.** Live `www.longvon.com/en/smart-ring-sdk-api` remains 404 until approved release.

## CGE-001 follow-up (2026-11-11)
- CN page parity: Boundaries / Ring1C non-medical / customer-owned App / licensing split / Twitter meta.
- EN meta/OG softened to “qualified partners” / “project-scoped”.
- CN header `NAV_ZH` adds SDK / API; EN footer duplicate SDK link removed from Explore column (kept under Technology).
- Evidence: `docs/geo/phase-4.2/cge-001/evidence/ssr-smoke-cge-001.txt`
