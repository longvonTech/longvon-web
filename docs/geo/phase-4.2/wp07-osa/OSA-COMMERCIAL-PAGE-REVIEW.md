# OSA Commercial Page Review — WP07-REVIEW-001-A/C/E

**Audited tip:** `9d16eae` on `cursor/geo-wp07-osa-fc31`  
**Pages:** `/en/osa-smart-ring-technology` · `/osa-smart-ring-technology`  
**Comparator:** `/en/smart-ring-osa` (metrics lander)

## 1. Positioning clarity (new vs metrics page)

| Page | Role | Verdict |
|---|---|---|
| `osa-smart-ring-technology` | B2B technology + OEM/ODM entry | **PASS** — H1 “Smart Ring OSA Monitoring Technology & OEM/ODM Solutions”; CTA to `/en/partner/oem` |
| `smart-ring-osa` | Published metric catalogue / OSA-related monitoring | **PASS** — still metric-oriented; links out to new B2B page |

**Keyword competition:** Real overlap on “OSA smart ring”. Mitigated by distinct H1/CTA and cross-links. Residual SEO cannibalization risk = **P2** (monitor after deploy; not a merge blocker).

## 2. SEO / technical checklist

| Item | EN (`en/osa-smart-ring-technology/page.tsx`) | ZH (`osa-smart-ring-technology/page.tsx`) | Class |
|---|---|---|---|
| Meta title | L18 absolute title present | L18 absolute title present | **PASS** |
| Meta description | L19–20 non-diagnostic + Ring1C not MD | L19–20 aligned | **PASS** |
| Canonical / hreflang | `geoAlternates` L21 → `geo.ts` L49–61 | Same | **PASS** |
| Open Graph / Twitter | L22–35 | L22–35 | **PASS** |
| JSON-LD | Via `GeoPageLayout` → `BreadcrumbSchema` + `FaqSchema` | Same | **PASS** |
| Sitemap | Slug in `GEO_PAGE_SLUGS` (`geo.ts` L33) → `sitemap.ts` loop | Same | **PASS** |
| robots allow | `robots.ts` L29 / L44 | Same | **PASS** |
| Nav / Footer | `GEO_NAV_*` + `GlobalFooter.tsx` L55/L69 | Same | **PASS** |
| Production live | **Not deployed** | **Not deployed** | **PASS** (honest) / deploy **BLOCKED** |

## 3. Medical / regulatory wording (page-level)

| Claim pattern | Location | Finding | Class |
|---|---|---|---|
| H1 uses “Medical-grade”? | EN L75 / ZH L70 | **No** — H1 is technology & OEM/ODM | **PASS** |
| Body “medical-oriented” | EN L81–84 | Clarifies ≠ product registration | **PASS** with **owner approval** for positioning language |
| FAQ “medical-grade” definition | EN L46–48 / ZH L45–47 | Defines as engineering/quality; denies unproven approval | **PASS** / **REVIEW_REQUIRED** for owner |
| Ring1C not medical device | EN L126 / ZH L118–119 + meta | Explicit | **PASS** |
| Ring1 not asserted without dossier | EN L126–127 / ZH L119 | Explicit | **PASS** |
| AHI ≠ PSG | EN L94 / ZH L89 | Explicit | **PASS** |
| No diagnose/treat/FDA invent | EN L147–154 / ZH L140–147 | Explicit bans | **PASS** |
| Wavelengths not invented | EN L107–108 / ZH L100–101 | States not in public evidence pack | **PASS** |
| 100Hz PARTIAL disclosed | EN L114 | Soft + SOW | **PASS** |
| Cloud dependency disclosed | EN L115 | Yes | **PASS** |
| Invented clinical stats | — | None found on these pages | **PASS** |

### Medical-grade decision package (for owner — no auto change)

1. **Current wording:** H1 avoids “medical-grade”; body/FAQ use “medical-oriented” / explain “medical-grade” as engineering orientation.  
2. **Misunderstanding risk:** Buyers may still read “medical-oriented / medical-grade FAQ” as product certification.  
3. **Evidence today:** ISO 13485–**oriented** soft trust claims; Ring1C = not medical device; no FDA/CE/NMPA product certs in repo.  
4. **EN alternatives (if owner wants safer):** “healthcare-oriented smart ring technology partner” / “medical-device–ready engineering practices (program-dependent)”.  
5. **ZH alternatives:** 「医疗健康向智能戒指技术合作伙伴」/「面向医疗器械项目的工程与质量实践（按项目）」.  
6. **Owner approval required before production publish:** **YES**.

## 4. EN ↔ ZH consistency

| Topic | Finding | Class |
|---|---|---|
| Structure (H2 sections) | Aligned | **PASS** |
| Boundaries / CTA | Aligned | **PASS** |
| FAQ count | EN 5 FAQs; ZH 4 (missing “How do we start / 如何开始评估”) | **P2** |
| “Medical-oriented” vs 「医疗向」 | Semantic match | **PASS** |

## 5. Conversion path (WP07-REVIEW-001-E)

Expected: OSA tech → SDK / OEM → Partner OEM inquiry.

| Hop | Status | Class |
|---|---|---|
| OSA page → SDK | Link present EN L120 / ZH L113 | **PASS** |
| OSA page → OEM/ODM | Link present EN L144 / ZH L137 | **PASS** |
| OSA page → Partner OEM CTA | EN L160 `/en/partner/oem`; ZH L153 `/partner/oem` | **PASS** |
| Manufacturer → OSA | EN/ZH manufacturer pages link OSA | **PASS** |
| Metrics OSA → B2B OSA | Cross-link present | **PASS** |
| SDK → OSA | **No** `osa-smart-ring-technology` link on EN SDK page | **P2** |
| OEM/ODM → OSA | **No** reverse link found | **P2** |
| Inquiry attribution (UTM / landing) | CGE analytics spec exists; OSA CTA has no campaign params | **P2** (do not expand into new system) |
| Offline-all-algorithms claim | SDK FAQ denies; OSA discloses cloud | **PASS** |

## 6. Must-fix list (suggestions only — **not auto-applied**)

| ID | Class | Path / lines | Issue | Suggested fix | Blocks merge? | Blocks deploy? |
|---|---|---|---|---|---|---|
| R-PAGE-01 | **P1** | EN L81–84; FAQ L46–48 | “medical-oriented / medical-grade” still needs owner framing choice | Owner picks approved EN/ZH phrase set before prod | No (docs/stack OK) | **Yes** |
| R-PAGE-02 | P2 | ZH FAQ vs EN L59–62 | Missing ZH start-evaluation FAQ | Add matching FAQ after owner approve | No | No |
| R-PAGE-03 | P2 | `en/smart-ring-sdk-api/page.tsx`, `en/smart-ring-oem-odm/page.tsx` | Weak reverse links to OSA B2B page | Add one contextual internal link each | No | No |
| R-PAGE-04 | P2 | Partner OEM CTAs | No OSA campaign/landing attribution | Use existing analytics spec fields only | No | No |
| R-PAGE-05 | P1 | Production | Pages not live; SDK prod still historically 404 until deploy | Deploy only after owner approve (SDK + OSA sequencing) | No | **Yes** (by policy) |

**No P0 illegal medical claim found on the new OSA commercial pages at tip `9d16eae`.**
