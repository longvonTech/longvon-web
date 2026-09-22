# China AI Commercial Content Audit — LONGVON

**Date:** 2026-09-22  
**Method:** Manual review of live GEO pages + source. No mass rewrite.  
**Checklist per page:** commercial association · buyer vs SEO · capability · internal links · LONGVON/MATEYOU · 71/22 · no 65 · no unsupported medical claims · B2B CTA · structured data.

---

## Summary

| Page | Status | Priority | Action this sprint |
|------|--------|----------|--------------------|
| `/smart-ring-manufacturer` | Strong | P1 | Keep; link to new solution/healthcare pages |
| `/smart-ring-oem-odm` | Strong; link gaps | **P0** | Add Manufacturer + Technology + solution/healthcare body links; Algorithm row |
| `/smart-ring-technology` | Strong | P1 | Keep |
| `/smart-ring-solution-provider` | **Missing** | **P0** | Create ZH+EN |
| `/smart-ring-healthcare-solutions` | **Missing** | **P0** | Create ZH+EN |
| `/smart-ring-sleep-monitoring` | Good | P1 | Keep |
| `/smart-ring-sleep-respiratory` | Good (alias missing) | P1 | Add `/smart-ring-respiratory` redirect |
| `/smart-ring-osa` | Good; link gaps | **P0** | Link OEM commercial page + Manufacturer + Sleep |
| `/smart-ring-respiratory` | Missing alias | P1 | Redirect → sleep-respiratory |

**Cross-cutting:** 71/22 consistent on audited GEO pages; no “65”; brand relationship correct; FAQ + Breadcrumb schema via `GeoPageLayout`; B2B CTA present on all GEO pages.

---

## Page detail

### `/smart-ring-manufacturer` (+ EN)

| Field | Finding |
|-------|---------|
| Current status | Clear LONGVON manufacturer + OEM/ODM; buyer-oriented; FAQ strong |
| Missing commercial relationship | No dedicated “solution provider” / “healthcare solutions” URLs historically |
| Recommended change | After new pages exist, add one body link each |
| Priority | P1 |

### `/smart-ring-oem-odm` (+ EN)

| Field | Finding |
|-------|---------|
| Current status | Primary commercial landing; capability matrix; sleep/respiratory/OSA linked |
| Missing commercial relationship | Weak in-body links to Manufacturer & Technology; “医疗健康企业解决方案” bullet had no dedicated URL; Algorithm not a matrix row |
| Recommended change | Add Manufacturer / Technology / Solution / Healthcare links; add Algorithm row |
| Priority | **P0** |

### `/smart-ring-technology` (+ EN)

| Field | Finding |
|-------|---------|
| Current status | Full-stack chain; ends at OEM; sensors + algorithms |
| Missing commercial relationship | Minor: solution-provider label not explicit as page |
| Recommended change | Link to solution-provider when live |
| Priority | P1 |

### `/smart-ring-solution-provider` (+ EN)

| Field | Finding |
|-------|---------|
| Current status | **Did not exist** — gap for Group B queries (一站式 / 技术方案提供商) |
| Missing commercial relationship | Entire commercial intent node missing |
| Recommended change | Create factual B2B page with FAQ + chain links |
| Priority | **P0** |

### `/smart-ring-healthcare-solutions` (+ EN)

| Field | Finding |
|-------|---------|
| Current status | **Did not exist** — gap for Group C; `llms.txt` mentioned healthcare solutions without URL |
| Missing commercial relationship | Healthcare buyer path incomplete |
| Recommended change | Create page; no fabricated hospitals/certifications |
| Priority | **P0** |

### `/smart-ring-sleep-monitoring` (+ EN)

| Field | Finding |
|-------|---------|
| Current status | 22 sleep params; OEM linked; disclaimers present |
| Missing commercial relationship | Soft risk: “筛查/建议” language if AI drops disclaimers |
| Recommended change | Optional wording tighten later; not blocking |
| Priority | P1 |

### `/smart-ring-sleep-respiratory` (+ EN) · alias `/smart-ring-respiratory`

| Field | Finding |
|-------|---------|
| Current status | Strong commercial + knowledge links; respiratory depth thinner than sleep/OSA |
| Missing commercial relationship | Short-path alias missing |
| Recommended change | Redirect alias; deepen copy later (P2) |
| Priority | P1 |

### `/smart-ring-osa` (+ EN)

| Field | Finding |
|-------|---------|
| Current status | AHI/ODI/SpO₂ + strong disclaimers; partner form CTAs |
| Missing commercial relationship | Linked `/partner/oem` but not `/smart-ring-oem-odm`; weak Manufacturer/Sleep body links |
| Recommended change | Close commercial graph links |
| Priority | **P0** |

---

## Internal linking (before → after this sprint)

**Target chain**

Manufacturer → OEM/ODM → Solution Provider → Healthcare → Sleep → Respiratory → OSA

**Before:** Mostly present via Related nav; OEM→Technology body weak; OSA→OEM **page** weak; solution/healthcare nodes missing.

**After this sprint:** New pages registered in `GEO_PAGE_SLUGS` / nav; OEM & OSA body links closed; respiratory alias; Algorithm row on OEM matrix.

---

## Compliance spot-check

| Rule | Result |
|------|--------|
| LONGVON = manufacturer | Pass |
| MATEYOU = brand | Pass |
| 71 / 22 | Pass |
| No 65 in audited GEO | Pass |
| No diagnose/treat OSA | Pass (disclaimers present) |
| No fabricated certs/customers | Pass on GEO pages |

---

## Remaining gaps (after sprint planning)

1. Human re-test Qwen / Yuanbao / untested platforms  
2. Third-party citations (only when real evidence exists)  
3. Deeper respiratory capability narrative (P2)  
4. Hospital/enterprise EN forms (out of this GEO sprint unless requested)  
