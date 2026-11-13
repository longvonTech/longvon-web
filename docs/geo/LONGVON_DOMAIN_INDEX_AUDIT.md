# LONGVON_DOMAIN_INDEX_AUDIT.md

Generated: 2026-11-10T13:00:47Z (read-only live fetch)

## Domains
| Host | Observation |
|---|---|
| www.longvon.com | 200 OK; Next.js; primary production site |
| new.longvon.com | **301 → https://www.longvon.com/** (path `/`) — apex/staging alias redirect confirmed |

## Robots.txt
- Baiduspider allow-list includes GEO cluster + `/en/` commercial paths (see evidence/robots.txt).
- No blanket Disallow of commercial EN pages observed in fetched file.
- **Do not** add broad noindex without approval.

## Sitemap
- URL count: **130**
- Includes manufacturer, oem-odm, technology, healthcare, about, company, sleep, OEM partner paths.
- Missing: `/en/smart-ring-sdk-api` (page **404** — not in sitemap; expected until page created).

## Live page checks (sample)
| URL | status | lang | canonical | robots meta | noindex |
|---|---|---|---|---|---|
| https://www.longvon.com/ | 200 | zh-CN | https://www.longvon.com | index, follow | False |
| https://www.longvon.com/en/smart-ring-manufacturer | 200 | en | https://www.longvon.com/en/smart-ring-manufacturer | index, follow | False |
| https://www.longvon.com/en/partner/oem | 200 | en | https://www.longvon.com/en/partner/oem | index, follow | False |
| https://www.longvon.com/en/smart-ring-technology | 200 | en | https://www.longvon.com/en/smart-ring-technology | index, follow | False |
| https://www.longvon.com/en/smart-ring-healthcare-solutions | 200 | en | https://www.longvon.com/en/smart-ring-healthcare-solutions | index, follow | False |
| https://www.longvon.com/en/about | 200 | en | https://www.longvon.com/en/about | index, follow | False |
| https://www.longvon.com/en/company/longvon | 200 | en | https://www.longvon.com/en/company/longvon | index, follow | False |

## Redirects
- Contact → OEM: nginx 301 (Phase 3/4.1 verified; not re-changed).
- new.longvon.com → www.

## Risks / recommendations
1. Dual GEO hubs: `/en/smart-ring-oem-odm` vs `/en/partner/oem` — clarify IA (conversion vs narrative).
2. SDK URL gap (404) blocks SDK query capture landing.
3. GSC/Bing index coverage: **N/A** (no console access).
4. Do not mass-noindex knowledge URLs without duplicate-content evidence.

Evidence: `docs/geo/phase-4.2/evidence/`
