# PHASE-3 Search Engine Baseline

**Status:** 监测框架已开发 / 账户数据 **N/A / UNVERIFIED**（无 Bing/GSC 只读授权）

## E1. Bing Webmaster

| Check | Status |
|---|---|
| Account connected | UNVERIFIED |
| Site permission | UNVERIFIED |
| URL index — `/en/smart-ring-manufacturer` | N/A |
| URL index — `/en/partner/oem` | N/A |
| Crawl status | N/A |
| Meta Description warnings | N/A |
| Impressions / clicks / CTR / avg position | N/A |

## E2. Google Search Console

| Check | Status |
|---|---|
| Property connected | UNVERIFIED |
| Performance readable | N/A |
| Indexing readable | N/A |
| URL inspection for focus pages | N/A |
| Structured data issues | N/A |

Code audit note (`SEARCH-MONITORING.md`): no GA4/gtag/GTM in repo; Baidu analytics only if env ID provided.

## E3. Keyword monitor list

| Keyword | Landing focus | Impr | Clicks | CTR | Position |
|---|---|---|---|---|---|
| smart ring manufacturer | `/en/smart-ring-manufacturer` | N/A | N/A | N/A | N/A |
| smart ring OEM | `/en/partner/oem` | N/A | N/A | N/A | N/A |
| smart ring ODM | `/en/partner/oem` | N/A | N/A | N/A | N/A |
| medical grade smart ring | Manufacturer / Healthcare | N/A | N/A | N/A | N/A |
| smart ring SDK | Technology / OEM | N/A | N/A | N/A | N/A |
| smart ring API | Technology / OEM | N/A | N/A | N/A | N/A |
| smart ring sleep monitoring | `/en/smart-ring-sleep-monitoring` | N/A | N/A | N/A | N/A |
| smart ring health monitoring | Manufacturer / Healthcare | N/A | N/A | N/A | N/A |

**Caution:** “medical grade” must not be mirrored as an unverified regulatory claim on-site.

## E4. Live HTML signals (public, non-console)

Captured 2026-11-08 from `https://www.longvon.com`:

| URL | html lang | Meta description chars | Notes |
|---|---|---|---|
| `/en/smart-ring-manufacturer` | `zh-CN` | 189 | Pre-FIX-01; FIX-01 candidate targets 145 + `lang=en` |
| `/en/partner/oem` | `zh-CN` | 334 | Pre-FIX-01; candidate targets 152 + `lang=en` |

## Authorization needed

- Bing Webmaster read-only property or CSV export
- GSC read-only property / URL inspection / Performance export
- Optional GA4/GTM — separate privacy/consent approval (not installed this phase)

Post-release crawl timers (7/14/30) **must not start** until FIX-01 is actually published.
