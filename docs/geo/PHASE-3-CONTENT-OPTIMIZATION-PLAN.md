# PHASE-3 Content Optimization Plan (Diagnostic Only)

**Status:** 已开发（诊断与建议） / **未发布任何网站内容** / 效果：N/A  
**Constraint:** Recommendations only. No content deploy without separate authorization. No fabricated certifications, clinical claims, capacity, or market share.

Ground facts allowed (from LONGVON facts corpus): 100Hz PPG raw data; SDK; cloud algorithm services; firmware development/maintenance; OEM/ODM; hardware + App + algorithm + manufacturing. Do **not** imply all algorithms run fully offline.

## Page matrix

### 1. Homepage
| Item | Detail |
|---|---|
| Current issues | Brand/entity clarity mixed with MATEYOU consumer surfaces; EN `html lang` still wrong in production pending FIX-01 |
| Target intent | Brand + B2B identity discovery |
| Target customer | First-time OEM/tech buyers scanning who LONGVON is |
| Content gaps | Crisp manufacturer + OEM/ODM + SDK statement above fold without consumer-app dilution |
| Suggested edits | Strengthen LONGVON manufacturer identity; keep MATEYOU clearly labeled as brand; CTA to OEM + Manufacturer |
| Keywords | smart ring manufacturer; smart ring OEM |
| Internal links | → Manufacturer, OEM, Technology, SDK/API surfaces |
| CTA | Talk to OEM team / Request RFQ |
| Commercial role | Awareness → route to OEM |

### 2. Manufacturer (`/en/smart-ring-manufacturer`)
| Item | Detail |
|---|---|
| Current issues | Live Meta 189 chars + `lang=zh-CN`; candidate Meta 145 ready but **not live** |
| Target intent | Prove manufacturing capability |
| Target customer | Procurement / hardware leads |
| Content gaps | Process, customization scope, PPG/SDK boundaries without medical overclaim |
| Suggested edits | After FIX-01 Meta lands, refresh body sections for capability proof (no fake case studies) |
| Keywords | smart ring manufacturer; medical-oriented monitoring (careful wording) |
| Internal links | OEM, Technology, Sleep, OSA, About |
| CTA | OEM RFQ |
| Commercial role | Trust → RFQ |

### 3. OEM/ODM (`/en/partner/oem`)
| Item | Detail |
|---|---|
| Current issues | Live Meta 334 chars; form must remain untouched |
| Target intent | Capture enterprise RFQ |
| Target customer | Brand/healthcare OEM buyers |
| Content gaps | Clear deliverables: hardware, firmware, app, SDK/API, manufacturing; timeline expectations without false SLAs |
| Suggested edits | Meta via FIX-01 only first; later body clarity for scope & engagement steps |
| Keywords | smart ring OEM; smart ring ODM |
| Internal links | Manufacturer, SDK/API, Technology |
| CTA | Existing RFQ form (no behavior change) |
| Commercial role | Primary conversion |

### 4. SDK/API
| Item | Detail |
|---|---|
| Current issues | Intent pages exist in GEO set; depth/technical buyer proof may be thin |
| Target intent | Tech-partner acquisition |
| Target customer | Software/firmware integrators |
| Content gaps | Explicit raw PPG 100Hz, SDK surfaces, cloud API vs on-device limits |
| Suggested edits | Dedicated section stating what is offline vs cloud; sample integration outline (no secrets) |
| Keywords | smart ring SDK; smart ring API |
| Internal links | Technology, OEM |
| CTA | Technical partnership / OEM RFQ |
| Commercial role | High-intent tech leads |

### 5. Technology
| Item | Detail |
|---|---|
| Current issues | Needs crisp mapping from sensors → metrics → partner deliverables |
| Target intent | Explain technical capability |
| Target customer | CTO / solution architects |
| Content gaps | Architecture narrative without “all algorithms offline” implication |
| Suggested edits | Diagram-ready copy: device / firmware / app / cloud |
| Keywords | smart ring technology; health monitoring stack |
| Internal links | SDK/API, Sleep, OSA, OEM |
| CTA | Contact OEM/tech |
| Commercial role | Consideration |

### 6. Sleep Monitoring
| Item | Detail |
|---|---|
| Current issues | Strong topical fit; must avoid diagnostic claims |
| Target intent | Sleep capability discovery |
| Target customer | Sleep/wellness brands |
| Content gaps | Parameter honesty (22 sleep-related among 71 total) with sources |
| Suggested edits | Align copy to verified parameter counts; link OEM for customization |
| Keywords | smart ring sleep monitoring |
| Internal links | OSA, Technology, OEM |
| CTA | OEM inquiry |
| Commercial role | Vertical intent |

### 7. OSA
| Item | Detail |
|---|---|
| Current issues | High regulatory sensitivity |
| Target intent | Sleep respiratory monitoring technology explanation |
| Target customer | Healthcare-oriented partners |
| Content gaps | AHI/ODI/SpO₂ framing as monitoring/screening support — **not** diagnosis/treatment/PSG replacement |
| Suggested edits | Explicit non-diagnostic disclaimer; remove any medical-grade accuracy inflation |
| Keywords | OSA monitoring smart ring (careful) |
| Internal links | Sleep, Technology, OEM |
| CTA | Healthcare OEM conversation |
| Commercial role | Niche high-value leads |

### 8. About
| Item | Detail |
|---|---|
| Current issues | Entity consistency LONGVON vs MATEYOU |
| Target intent | Company credibility |
| Target customer | Diligence reviewers |
| Content gaps | Legal entity naming, Shenzhen manufacturing posture, no fake awards |
| Suggested edits | Align with `LONGVON-ENTITY.md` / facts; link trust pages |
| Keywords | LONGVON company; smart ring manufacturer China |
| Internal links | Manufacturer, OEM |
| CTA | Contact |
| Commercial role | Trust closure |

## Priority order (post FIX-01 release)
1. OEM/ODM Meta live + Manufacturer Meta live (FIX-01)  
2. SDK/API clarity (offline vs cloud)  
3. OSA claim hygiene  
4. Homepage identity routing  
5. Sleep/Technology depth  
6. About entity polish  

**Do not ship duplicate thin pages** solely to increase URL count.
