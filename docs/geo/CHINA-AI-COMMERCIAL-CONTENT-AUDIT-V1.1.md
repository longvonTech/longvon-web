# China AI Commercial Content Audit v1.1

**Date:** 2026-09-22  
**After:** Qwen/Yuanbao-oriented extractability pass  
**Legend:** Y = clearly present · P = partial · N = absent / not applicable

| Page | LONGVON identity | OEM | ODM | Manufacturer | Hardware | Firmware | Algorithm | App | SDK | Manufacturing | Healthcare | Sleep | Respiratory | OSA |
|------|------------------|-----|-----|--------------|----------|----------|-----------|-----|-----|---------------|------------|-------|--------------|-----|
| `/smart-ring-manufacturer` (+EN) | Y | Y | Y | Y | Y | Y | P | Y | Y | Y | Y | Y | Y | Y |
| `/smart-ring-oem-odm` (+EN) | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| `/smart-ring-solution-provider` (+EN) | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | P | N | N |
| `/smart-ring-healthcare-solutions` (+EN) | Y | Y | Y | Y | Y | Y | Y | Y | Y | P | Y | Y | Y | Y |
| `/smart-ring-technology` (+EN) | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | P | Y | Y | Y |
| `/smart-ring-sleep-monitoring` (+EN) | Y | Y | P | Y | P | P | P | P | P | P | Y | Y | P | P |
| `/smart-ring-sleep-respiratory` (+EN) | Y | Y | P | Y | P | P | P | P | P | P | Y | Y | Y | Y |
| `/smart-ring-osa` (+EN) | Y | Y | P | Y | P | P | P | P | P | P | Y | Y | Y | Y |
| `/smart-ring-respiratory` | alias → sleep-respiratory | — | — | — | — | — | — | — | — | — | — | — | Y | — |
| `/llms.txt` | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Organization Schema | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |

### Notes

- **Algorithm = P** on manufacturer historically; v1.1 OEM/solution/healthcare pages list algorithms explicitly.  
- Sleep / respiratory / OSA pages remain knowledge-led; commercial OEM co-occurrence strengthened without keyword stuffing.  
- Manufacturing on healthcare = P for “量产交付” framing via OEM link, not a factory marketing page.  
- No “65 parameters” as product claim on audited public GEO pages.  
- MATEYOU not described as manufacturer on audited pages (FAQ explicitly denies).  

### Evidence caution

| Claim | Status |
|-------|--------|
| Industrial / mechanical design as standalone service line | Not elevated to a primary bullet (OEM/ODM already covers appearance/customization discussion) |
| Prototype / sampling as dedicated offering | Not claimed as a named service package |
| Specific hospital / certification / accuracy | Not added |
| Customer names | Not added |
