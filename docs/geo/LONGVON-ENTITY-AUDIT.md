# LONGVON Entity Audit

**Task:** TASK-GEO-001  
**Date:** 2026-09-20  
**Scope:** Pre-change audit of entity consistency across the mateyou-platform web app.

---

## Architecture findings

| Area | Finding |
|------|---------|
| Next.js | App Router (`apps/web`), standalone production output |
| i18n | **None** — no `next-intl`, no `middleware.ts`, no language switcher |
| Document lang | Root `<html lang="zh-CN">` for entire site |
| GEO routes | 7 unprefixed pages (CN-oriented / mixed CN–EN) |
| SEO | `robots.ts`, `sitemap.ts`, `alternates.canonical`, no hreflang |
| Schema | `OrganizationSchema`, `WebSiteSchema`, Breadcrumb/FAQ via `GeoPageLayout` |
| llms.txt | `apps/web/public/llms.txt` — entity-positive, bilingual summaries |

**Decision:** Add parallel `/en/*` GEO routes + hreflang; do **not** migrate the full site to `[locale]` / next-intl in this phase.

---

## Entity string scan (pre-change)

### Unified / correct (majority)

- Brand token **LONGVON** (all caps) on GEO pages, footer, schema, llms.txt
- Legal CN: **龙汾科技（深圳）有限公司**
- Legal EN (schema/about): **LONGVON Technology (Shenzhen) Co., Ltd.**
- Role: smart ring technology manufacturer + OEM/ODM provider
- MATEYOU: brand developed by LONGVON; not manufacturer
- Metrics: **71 total / 22 sleep-related** (65 banned)

### Inconsistencies / gaps found

| Issue | Location | Severity | Action |
|-------|----------|----------|--------|
| No English URL layer | Sitewide | High | Add `/en/company/longvon` + 6 smart-ring pages |
| No hreflang | GEO metadata | High | Add `alternates.languages` |
| Root `lang=zh-CN` on EN-heavy pages | manufacturer, technology, sleep, osa | Medium | EN pages under `/en` + `HtmlLang` |
| Entity statement shorter than TASK statement | GEO pages / KB | Medium | Align to TASK CN/EN core statements |
| SDK / Cloud API | Soft “case-by-case” in body vs TASK core capabilities | Medium | State as capabilities; keep “partner access scoped per project” (no public portal claim) |
| Title-case “About Longvon” | `about/page.tsx` | Low | Prefer LONGVON |
| Consumer home still MATEYOU-first | `/` | Info | Out of GEO scope; keep |
| WebSiteSchema claims `inLanguage: en, zh-CN` without EN URLs | StructuredData | Medium | Valid after `/en` ships |

### Confirmed relationship (do not invent further)

```
LONGVON (manufacturer / OEM/ODM / technology)
  └── MATEYOU (smart ring product / AI health brand)
```

Legal ownership wording beyond “developed by LONGVON / 旗下品牌” is **not** independently verified in code — keep existing approved phrasing; do not invent equity structure.

### Medical / claim bans (still in force)

Do not add: diagnoses/treats OSA, clinically proven, FDA approved, medical-grade (unless already verified), leading/top/best/No.1.

---

## Existing GEO pages (status before TASK-GEO-001)

| Path | Content language | Notes |
|------|------------------|-------|
| `/company/longvon` | CN + EN blocks | Entity hub |
| `/smart-ring-manufacturer` | Mostly EN | Needs EN mirror + CN framing |
| `/smart-ring-oem-odm` | CN + EN | Strong China OEM wording |
| `/smart-ring-technology` | Mostly EN | |
| `/smart-ring-sleep-monitoring` | Mostly EN | |
| `/smart-ring-sleep-respiratory` | CN primary | |
| `/smart-ring-osa` | Mostly EN | Non-diagnosis compliant |

---

## Sources used for facts

1. `docs/geo/LONGVON-GEO-KNOWLEDGE-BASE.md` v1.2  
2. Live GEO page copy + `OrganizationSchema`  
3. TASK-GEO-001 official Entity Statements (CN/EN)  
4. Footer / About published company claims (High-Tech / Specialized SME = evidence level B)

---

## Audit conclusion

Foundation exists and is deployable. Missing piece for bilingual AI entity inclusion: **dedicated English GEO URLs, hreflang, sitemap EN entries, and unified entity statements**. Proceed with additive `/en` layer; no rebuild of consumer funnel.
