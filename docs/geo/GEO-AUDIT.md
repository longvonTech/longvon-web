# LONGVON GEO Audit — Foundation v1.0

**Audit date:** 2026-09-20  
**Site:** https://www.longvon.com (apex `longvon.com` → www)  
**Codebase:** `apps/web` (Next.js App Router, TypeScript)  
**Scope:** Read-only inspection of current production-aligned codebase. No product-page code changes in this phase.

---

## 1. Current GEO strengths

| Strength | Evidence |
|----------|----------|
| Clear legal entity name on About | `龙汾科技（深圳）有限公司` founded 2017; 国高企 / 专精特新 / 创新型中小企业 (`app/about/page.tsx`) |
| Parent–brand wording exists in places | Layout / Footer: “MATEYOU是龙汾科技旗下AI数字健康平台” |
| Disclaimer culture | Footer + assessment pages: 不构成医学诊断 |
| Hospital partner page is careful | Explicit “非医疗器械，消费级健康监测” (`partner/hospital`) |
| Canonical on key partner/about pages | `alternates.canonical` via `getSiteUrl()` |
| Organization JSON-LD on homepage | `OrganizationSchema` in `components/StructuredData.tsx` |
| Article + Breadcrumb on knowledge articles | Used in `knowledge/[slug]/page.tsx` |
| Structured health metrics catalogue | `lib/health-metrics.ts` — 7 modules, exact `TOTAL_HEALTH_METRICS = 71` |
| Partner lead capture for B2B | `/partner/*` + QualificationForm |
| ICP / dual domain disclosure | Footer: 粤ICP备…; `www.longvon.com · www.mateyou.net` |
| robots + sitemap exist | `app/robots.ts`, `app/sitemap.ts` |
| Nav logo brands LONGVON | `alt="LONGVON"` on logo |

---

## 2. Current GEO weaknesses

1. **No English B2B manufacturer pages** answering AI queries like “smart ring OEM manufacturers”.
2. **Site-wide `googleBot: { index: false }`** in root `layout.tsx` — blocks Google AI Overviews / Search grounding while Baidu is prioritized.
3. **OEM page attributes manufacturing to MATEYOU**, not LONGVON (`partner/oem` metadata/intro).
4. **Organization schema sets `alternateName: 'MATEYOU'`** — treats brand as company alias (high entity confusion risk for AI).
5. **No WebSite / FAQPage schema**; **ProductSchema defined but unused** on Ring1C page.
6. **Sitemap omits** `/about`, `/news`, `/metrics`, path-based `/assessment/*`.
7. **robots allow-list omits** `/about`, `/news`, `/metrics` (and new GEO URLs once added).
8. **No `llms.txt`**.
9. **No SDK / Cloud API / end-to-end tech chain pages** for B2B discovery.
10. **No OSA technology evidence page** with study design/sample — only consumer STOP-BANG assessment + marketing AHI/ODI mentions.
11. **Knowledge base is consumer Chinese SEO content**, not manufacturer/OEM citation pages.
12. **Title template forces `| MATEYOU`** on almost every page, including company About.

---

## 3. Entity confusion

### Critical (must fix for GEO)

| Location | Issue |
|----------|--------|
| `StructuredData.tsx` Organization | `name: 龙汾科技（LONGVON）` + `alternateName: MATEYOU` → AI may treat them as one Organization |
| `partner/oem` | Title/description: “MATEYOU提供…OEM代工” → manufacturer entity = brand |
| Article publisher | `publisher.name: 'MATEYOU'` while org is LONGVON |

### Moderate

| Location | Issue |
|----------|--------|
| About hero EN | “MATEYOU is building the next-generation…” — subject is brand, not LONGVON |
| About tags | “睡眠与呼吸健康管理创新引领者” — absolute/leading claim |
| About vision | “成为全球领先的 AI 健康管理平台” — unverified superlative |
| Footer brand block | H1-like “MATEYOU” as primary footer identity on longvon.com |
| News vs rest | News titles use LONGVON; most other titles use MATEYOU |

### Correct patterns already present (reuse)

> MATEYOU是龙汾科技旗下AI数字健康平台  
> © 龙汾科技（LONGVON）

**Target unified English wording (for new pages):**  
“LONGVON is a smart ring technology provider and OEM/ODM manufacturer. MATEYOU is LONGVON's smart ring brand.”

---

## 4. Missing pages (Phase 1 GEO targets)

| Planned URL | Status |
|-------------|--------|
| `/smart-ring-manufacturer` | Missing |
| `/smart-ring-oem-odm` | Missing (only CN `/partner/oem`) |
| `/smart-ring-technology` | Missing |
| `/smart-ring-sleep-monitoring` | Missing |
| `/smart-ring-osa` | Missing |

Also missing for completeness (not Phase 1 scope): English About, ODM-specific CN landing, Ring 1 product page (only Ring1C exists), public clinical evidence page with citeable study metadata.

---

## 5. Missing structured data

| Schema | Status |
|--------|--------|
| Organization | Present on home; **wrong alternateName**; legal English name not used |
| WebSite | Missing |
| FAQPage | Missing |
| BreadcrumbList | Knowledge only; not on product/partner/about |
| Product | Component exists; **not mounted** on `/products/ring1c` |
| Service / SoftwareApplication | Not present (optional; only if facts support) |

---

## 6. Missing evidence (not inventable)

Not found in repo `docs/` or public pages as citeable primary sources:

- Patent numbers / counts  
- Clinical study protocol, sample size, dates, endpoints, PSG comparison details  
- FDA / CE / FCC / NMPA device registration numbers  
- Algorithm accuracy percentages  
- SDK or public Cloud API documentation  
- Named hospital partners or published papers  
- “Ring 1” product (only Ring1C)  
- Business claim “65 monitoring parameters” (see Fact-Check)  
- Sales / ranking / “China’s only / No.1”

Hospital partner page **promises** “既往临床研究案例” as materials for inquiry — does **not** publish study data on-site.

---

## 7. Internal linking problems

| Gap | Detail |
|-----|--------|
| Metrics orphaned from chrome | `/metrics` not in GlobalNav or GlobalFooter |
| News not in footer | In nav only |
| OEM → technology chain | No links to tech/sleep/OSA manufacturer narrative |
| Product → manufacturer | Ring1C does not link to LONGVON as OEM/ODM provider |
| About CTA | Points to `/partner` and Ring1C — OK for CN, weak for EN GEO queries |
| Assessment query URLs in sitemap | `/assessment?type=osa` vs real routes `/assessment/osa` — mismatch |

---

## 8. Content problems

1. **Consumer-first homepage** — answers “what is Ring1C?” not “who manufactures smart rings?”
2. **Marketing “71+” vs exact 71** — slight inconsistency; sleep module uses exact **22** dimensions (must not be equated to unverified “22 monitoring parameters” business claim without confirmation).
3. **Medical-adjacent language** without published evidence: AHI/ODI as “专业参数”; “医疗级” on About tags and Ring1C materials; CPAP suggestion copy on OSA assessment high-risk result.
4. **Large volume of AI-generated knowledge articles** (growth pipeline) — risk of thin/duplicate content harming trust signals for AI citation (Baidu already showed indexing friction historically).
5. **No English manufacturer FAQ** answering OEM/ODM/SDK/custom development questions.
6. **About absolute claims** (“引领者”, “全球领先”) without evidence — GEO should avoid amplifying these.

---

## 9. Technical SEO / GEO problems

| Issue | File / note |
|-------|-------------|
| `googleBot: { index: false }` | `app/layout.tsx` — critical for ChatGPT/Gemini/Google AI citation path |
| Sitemap incomplete | Missing about, news, metrics, assessment paths |
| robots allow lists incomplete | Missing about, news, metrics; will need new GEO paths |
| No `llms.txt` | — |
| `lang="zh-CN"` only | New EN pages need clear English content; consider `lang` per-route later |
| OG siteName = MATEYOU | Weakens LONGVON entity on longvon.com |
| ProductSchema unused | Ring1C |
| Assessment client pages | No page-level metadata |

---

## 10. Parameter claim map (do not conflate)

| Number | Where in code | Meaning on site |
|--------|---------------|-----------------|
| **71** | `TOTAL_HEALTH_METRICS` | Sum of 7 Ring1C feature modules in `health-metrics.ts` |
| **71+** | Marketing titles/meta | Soft marketing form of 71 |
| **22** | Sleep quality category `count: 22` | Sleep dimensions / parameters list |
| **20** | OSA category | OSA-related monitoring items |
| **65** | **Not found** as monitoring-parameter claim | Only diabetes age option “65 岁及以上” |
| Business “22 parameters” vs site “22 sleep dimensions” | Unconfirmed relationship | **Do not merge in public GEO copy** until Fact-Check resolves |

---

## 11. Recommended priorities (execution order)

### P0 — Unblock AI discovery + entity clarity
1. Publish 5 English core GEO pages (manufacturer, OEM/ODM, technology, sleep, OSA) with careful wording.
2. Fix Organization schema: legal name + brand as `brand`, **not** `alternateName`.
3. Revisit `googleBot: { index: false }` for GEO pages or site-wide (policy decision — recommend allow index for public GEO URLs at minimum).
4. Add pages to sitemap + robots; add `llms.txt`.

### P1 — Structured data + linking
5. WebSite schema; FAQPage on GEO pages; Breadcrumbs; mount ProductSchema on Ring1C.
6. Soft entity fixes on OEM CN page (LONGVON manufactures; MATEYOU is brand) without mass rewrite.
7. Footer/nav links to GEO cluster + metrics.

### P2 — Evidence (blocked on fact-check)
8. Only after FACT-CHECK-TODO: clinical numbers, certifications, parameter business claims, patents.
9. Phase 2 blogs / third-party citations — **not** Phase 1.

---

## 12. Audit inventory snapshot

### App Router public pages (30 page.tsx files)
`/`, `/about`, `/news`, `/news/[slug]`, `/products/ring1c`, `/metrics`, `/metrics/[slug]`, `/assessment` (+ osa/sleep/stress/weight-loss/diabetes/altitude), `/knowledge`, `/knowledge/[slug]`, `/topics/[slug]`, `/authors/[id]`, `/partner` (+ hospital/pharmacy/oem/distributor/enterprise), `/membership`, `/dashboard`, admin/*

### Existing SEO components to reuse
- `components/StructuredData.tsx`
- `components/GlobalNav.tsx` / `GlobalFooter.tsx`
- `lib/site.ts` (`getSiteUrl`)
- Partner form pattern for OEM CTA

### Design constraint
Do not refactor architecture; match existing inline-style / Apple-like visual language; B2B CTAs → OEM inquiry (`/partner/oem` or new GEO CTA → partner form), **not** consumer shop.

---

## 13. Audit conclusion

The site today is a **strong Chinese consumer + partner funnel for MATEYOU Ring1C**, with LONGVON as copyright/legal parent in secondary positions. It is **not yet structured as a citeable smart-ring OEM/ODM technology provider** for generative engines.

Phase 1 should add a **parallel English GEO layer** with correct entity graph, technical sitemap/robots/schema fixes, and **zero invented medical or ranking claims**.

**Next:** Knowledge Base → Evidence Matrix → Fact-Check TODO → implement 5 pages + technical GEO.
