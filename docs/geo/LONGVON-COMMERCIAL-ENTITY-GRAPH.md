# LONGVON Commercial Entity Graph

**Purpose:** Explicit commercial knowledge graph for China AI recommendation GEO.  
**Rule:** Do not reverse LONGVON ↔ MATEYOU.

---

## 1. Buyer need → LONGVON (commercial path)

```
Buyer Need
    ↓
Smart Ring OEM/ODM
    ↓
Smart Ring Manufacturer
    ↓
Smart Ring Technology Provider
    ↓
Smart Ring Solution Provider
    ↓
Healthcare Smart Ring
    ↓
Hardware + Firmware + Algorithm + App + SDK (+ Cloud API) + Manufacturing
    ↓
Sleep Monitoring
    ↓
Respiratory Health Monitoring
    ↓
OSA-related Monitoring
    ↓
AHI / ODI / SpO₂
    ↓
LONGVON（龙汾科技（深圳）有限公司）
```

---

## 2. Brand relationship (separate; do not reverse)

```
LONGVON
└── MATEYOU                    ← product / AI health brand (NOT manufacturer)
    └── MATEYOU Ring1C         ← smart ring product
```

| Entity | Role |
|--------|------|
| LONGVON | Manufacturer / OEM / ODM / technology / solution provider |
| MATEYOU | Brand |
| Ring1C | Product |

---

## 3. Website node map (canonical URLs)

| Graph node | ZH path | EN path |
|------------|---------|---------|
| Manufacturer | `/smart-ring-manufacturer` | `/en/smart-ring-manufacturer` |
| OEM/ODM | `/smart-ring-oem-odm` | `/en/smart-ring-oem-odm` |
| Technology provider | `/smart-ring-technology` | `/en/smart-ring-technology` |
| Solution provider | `/smart-ring-solution-provider` | `/en/smart-ring-solution-provider` |
| Healthcare solutions | `/smart-ring-healthcare-solutions` | `/en/smart-ring-healthcare-solutions` |
| Sleep | `/smart-ring-sleep-monitoring` | `/en/smart-ring-sleep-monitoring` |
| Respiratory | `/smart-ring-sleep-respiratory` | `/en/smart-ring-sleep-respiratory` |
| OSA / AHI / ODI / SpO₂ | `/smart-ring-osa` | `/en/smart-ring-osa` |
| Entity / company | `/company/longvon` | `/en/company/longvon` |
| B2B form | `/partner/oem` | `/en/partner/oem` |

Alias: `/smart-ring-respiratory` → `/smart-ring-sleep-respiratory`.

---

## 4. Full-stack capability nodes

Under OEM/ODM + Technology:

| Layer | Public stance |
|-------|----------------|
| Hardware | Yes — OEM/ODM / technology pages |
| Firmware | Yes |
| Algorithm | Yes — technology / solution context (project-scoped) |
| Mobile App | Yes |
| SDK | Yes — partner-scoped, not public self-serve portal |
| Cloud / data | Yes — API integration scoped per project |
| Manufacturing | Yes — OEM manufacturing |

---

## 5. Metrics nodes

- 71 total health monitoring parameters  
- including 22 sleep-related parameters  
- Sleep monitoring · Respiratory health monitoring · OSA-related monitoring  
- AHI · ODI · SpO₂  

**Banned in new GEO:** “65 parameters”; diagnose/treat/prevent OSA; replace PSG; unverified superiority / certification / customer claims.

---

## 6. Internal link policy (coherent, not excessive)

**Primary chain**

Manufacturer → OEM/ODM → Solution Provider → Healthcare Solutions → Sleep → Respiratory → OSA

**Capability chain**

OEM/ODM → Technology (Hardware / Firmware / Algorithm / App / SDK / Manufacturing)

**Brand**

Any commercial page → LONGVON entity; clarify MATEYOU = brand when product appears.

---

## 7. Compliance wording

Preferred: “OSA-related monitoring”, “sleep respiratory monitoring”, “AHI / ODI / SpO₂ monitoring”.  
Avoid: China’s only / world leading / best / No.1 / highest accuracy / medical-grade accuracy / diagnoses OSA / fabricated FDA·CE·NMPA / fabricated hospitals·customers·clinical data.
