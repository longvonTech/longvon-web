# LONGVON Entity Consistency

**Task:** TASK-GEO-001  
**Date:** 2026-09-20  
**Status:** Aligned for bilingual GEO foundation

---

## Canonical statements

| Key | Value |
|-----|-------|
| ZH entity | LONGVON 是一家智能戒指技术制造商及 OEM/ODM 服务商，专注于智能戒指硬件、固件、移动 App、SDK、云端 API 及健康监测解决方案的定制开发与生产。 |
| EN entity | LONGVON is a smart ring technology manufacturer and OEM/ODM provider specializing in customized smart ring hardware, firmware, mobile apps, SDKs, cloud APIs, and health monitoring solutions. |
| Brand relation | LONGVON = manufacturer/OEM/ODM · MATEYOU = smart ring product brand |
| Metrics | 71 total health monitoring parameters, including 22 sleep-related parameters. |
| Legal ZH | 龙汾科技（深圳）有限公司 |
| Legal EN | LONGVON Technology (Shenzhen) Co., Ltd. |

Source of truth in code: `apps/web/lib/geo.ts`  
Docs: `LONGVON-ENTITY.md`, `LONGVON-FACTS.md`

---

## Surface checklist

| Surface | Status | Notes |
|---------|--------|-------|
| Header / GlobalNav | OK | Consumer CN nav; GEO pages have own chrome |
| Footer | OK | Updated to TASK entity statement |
| About | OK | “About LONGVON” casing fixed |
| Metadata (ZH GEO) | OK | hreflang + self-canonical |
| Metadata (EN GEO) | OK | `/en/*` self-canonical + hreflang |
| JSON-LD Organization | OK | Updated description, knowsAbout, dual mainEntityOfPage |
| Page body ZH | OK | Entity hub + OEM/manufacturer/respiratory leads aligned |
| Page body EN | OK | 7 dedicated B2B English pages |
| Sitemap | OK | ZH + EN GEO URLs |
| robots.txt | OK | Allows `/en/*` GEO paths |
| llms.txt | OK | Dual language core page lists |
| OpenGraph / Twitter | OK | EN pages include twitter summary cards |
| Breadcrumb / internal links | OK | Locale-aware `GeoPageLayout` nav |
| Language switcher | OK | Per-page EN ↔ 中文 on GEO layout |

---

## Remaining non-blocking drift

| Item | Risk | Action |
|------|------|--------|
| Home `/` still MATEYOU-first consumer messaging | Low for GEO | Out of Phase 1 scope |
| Some ZH GEO bodies still mixed EN technical prose | Low | Acceptable for China+global hybrid; EN mirrors are clean |
| Root `<html lang="zh-CN">` | Medium | Mitigated by `HtmlLang` on `/en` + hreflang |
| SDK/Cloud API “public portal” | N/A | Explicitly not claimed; partner-scoped only |
| Assessment / Ring1C marketing adjectives | Low | Not part of GEO entity pages |

---

## Conflict resolution applied

1. Unified entity statements to TASK-GEO-001 wording  
2. Brand relation phrasing: manufacturer vs product brand  
3. Added English URL layer so `WebSiteSchema.inLanguage` is no longer aspirational only  
4. Removed ineffective “About Longvon” title-case inconsistency on About page  

No inventing of ratings, awards, medical approvals, or market-share claims.
