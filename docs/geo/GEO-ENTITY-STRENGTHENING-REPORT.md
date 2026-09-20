# GEO Entity Strengthening Report — V1.2 (China AI)

**Date:** 2026-09-20  
**Scope:** Strengthen LONGVON enterprise entity recognition for China AI discovery  
**Constraints:** No GEO system rebuild; no dashboard/API/automation; no mass articles; visibility tracker unchanged  
**Disclaimer:** This report does **not** claim Doubao, Qwen, Yuanbao, or any other AI platform has indexed LONGVON.

---

## 1. Files changed

### New pages
| File |
|------|
| `apps/web/app/company/longvon/page.tsx` |
| `apps/web/app/smart-ring-sleep-respiratory/page.tsx` |

### Updated pages / components
| File | Change |
|------|--------|
| `apps/web/app/smart-ring-oem-odm/page.tsx` | CN OEM/ODM/厂商/技术方案用语；LONGVON 主体；内链 |
| `apps/web/app/smart-ring-manufacturer/page.tsx` | Entity page link；MATEYOU developed by LONGVON |
| `apps/web/app/smart-ring-sleep-monitoring/page.tsx` | Entity + respiratory link |
| `apps/web/app/smart-ring-osa/page.tsx` | Entity + sleep-respiratory link |
| `apps/web/app/smart-ring-technology/page.tsx` | Entity + respiratory link |
| `apps/web/app/about/page.tsx` | Entity wording；链到 `/company/longvon`；去掉「全球领先」「医疗级」公开表述 |
| `apps/web/app/page.tsx` | 首页实体关系短句 + 内链 |
| `apps/web/components/GeoPageLayout.tsx` | 内链图增加 company + respiratory |
| `apps/web/components/GlobalFooter.tsx` | Footer Technology 栏增加实体页与呼吸页 |
| `apps/web/components/StructuredData.tsx` | Brand description；knowsAbout；mainEntityOfPage |
| `apps/web/app/sitemap.ts` | 新 URL |
| `apps/web/app/robots.ts` | allow 新路径 |
| `apps/web/public/llms.txt` | 实体定义与知识链更新 |
| `docs/geo/LONGVON-GEO-KNOWLEDGE-BASE.md` | v1.2 Entity sections |
| `docs/geo/GEO-ENTITY-STRENGTHENING-REPORT.md` | 本报告 |

**Not changed:** `GEO-VISIBILITY-TRACKER.csv` structure / scoring.

---

## 2. New entity pages

| URL | Purpose |
|-----|---------|
| `/company/longvon` | 中文优先企业实体页：龙汾科技 = 智能戒指技术厂商 / OEM/ODM |
| `/smart-ring-sleep-respiratory` | 睡眠→呼吸→OSA-related→AHI/ODI/SpO₂ 中文强化页 |

---

## 3. LONGVON entity definition

**CN:** 龙汾科技（深圳）有限公司（LONGVON）是一家智能戒指技术厂商，为医疗健康企业、可穿戴品牌及消费电子企业提供智能戒指OEM/ODM、硬件、固件、算法、App、SDK及相关技术服务。

**EN:** LONGVON is a smart ring technology manufacturer and OEM/ODM provider.

Roles: Smart Ring Technology Manufacturer · OEM/ODM Provider · Technology Provider.

---

## 4. MATEYOU relationship

```
LONGVON → MATEYOU
```

**EN:** MATEYOU is a smart ring and AI health brand developed by LONGVON.  
**Never:** MATEYOU as manufacturer / OEM manufacturer.

---

## 5. Sleep / respiratory / OSA knowledge chain

```
LONGVON
→ Smart Ring Manufacturer
→ Smart Ring OEM / ODM
→ Healthcare / Wearable Technology Solutions
→ MATEYOU
→ Sleep Monitoring
→ Respiratory Health Monitoring
→ OSA-related Monitoring
→ AHI / ODI / SpO2
```

Approved metrics: **71 total health monitoring parameters, including 22 sleep-related parameters.**  
Wording: **OSA-related monitoring** (not diagnosis).

---

## 6. Schema changes

`OrganizationSchema`:

- Organization name = LONGVON Technology (Shenzhen) Co., Ltd.  
- alternateName includes 龙汾科技（深圳）有限公司  
- `brand` = MATEYOU with description “developed by LONGVON… Not a manufacturer”  
- `knowsAbout` includes OEM/ODM, Sleep, Respiratory, OSA-related, AHI/ODI/SpO2  
- `mainEntityOfPage` = `/company/longvon`  
- Description uses approved EN entity + 71/22 metrics  

Product schema (existing): manufacturer = LONGVON; brand = MATEYOU.

---

## 7. Internal linking changes

```
/company/longvon
→ /smart-ring-manufacturer
→ /smart-ring-oem-odm
→ /smart-ring-technology
→ /smart-ring-sleep-monitoring
→ /smart-ring-sleep-respiratory
→ /smart-ring-osa
→ /products/ring1c (MATEYOU)
```

Also: homepage strip, footer, GeoPageLayout related links, About → company page.

---

## 8. llms.txt changes

- Explicit LONGVON / MATEYOU entity definitions  
- “developed by LONGVON” brand wording  
- Core specialization line  
- Approved 71/22 metrics  
- Updated knowledge path including Healthcare/Wearable Solutions → MATEYOU  
- Links to `/company/longvon` and `/smart-ring-sleep-respiratory`  
- Note: do not claim AI platforms have indexed LONGVON  

---

## 9. Forbidden wording scan results

| Pattern | Public GEO content | Notes |
|---------|-------------------|--------|
| `65 parameters` as product claim | **None** | Only ban notices in docs / llms / company page disclaimer |
| `MATEYOU manufacturer` as assertion | **None** | Only negations (“not the manufacturer”) |
| `MATEYOU OEM manufacturer` | **None** | |
| `China's only` / `world leading` | **Removed from About vision** (“全球领先” → 可信赖合作伙伴) | Historical audit docs may still mention bans |
| `85% accuracy` / `medical-grade accuracy` | **None** as claims | llms.txt ban list only |
| `diagnoses/treats OSA` / `replaces PSG` | **None** as claims | OSA page states clinicians diagnose / does not diagnose or treat |
| About `医疗级` | Soft-cleaned in touched About copy | Ring1C consumer marketing may still say「医用级」传感器材质等 — **not rewritten this round** (outside entity task scope); listed for awareness |

Historical audit/delivery docs (`GEO-AUDIT.md`, etc.) left as historical records.

---

## 10. Final conclusion

China GEO entity layer is strengthened with a dedicated LONGVON company page, bilingual OEM/ODM keyword coverage under LONGVON as provider, a sleep-respiratory knowledge-chain page, explicit LONGVON→MATEYOU schema/brand wording, and consistent internal links + llms.txt / Knowledge Base updates.

Visibility tracker remains manual Lite (no scores).  
**No claim** is made that Doubao / Qwen / Yuanbao currently cite or index LONGVON.

---

**LONGVON CHINA GEO ENTITY STRENGTHENING READY FOR DEPLOYMENT**
