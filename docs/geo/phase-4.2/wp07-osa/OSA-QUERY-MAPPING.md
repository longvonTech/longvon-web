# OSA Query Mapping — WP07-REVIEW-001-D

**Policy:** Preserve Q001–Q072 and the CGE-001 12 high-value Queries. OSA-Q* is a parallel namespace only.

## 1. Preserved 12 high-value commercial Queries (unchanged)

| ID | Theme (CGE-001) | Primary page |
|---|---|---|
| Q011 | OEM/ODM services | `/en/smart-ring-oem-odm` |
| Q049 | Medical-oriented OEM | `/en/smart-ring-healthcare-solutions` |
| Q061 | 100Hz PPG raw | `/en/smart-ring-sdk-api` |
| Q032 | SDK + Cloud API | `/en/smart-ring-sdk-api` |
| Q016 | Manufacturer for brands | `/en/smart-ring-manufacturer` |
| Q014 | Custom HW+SW | `/en/smart-ring-oem-odm` |
| Q033 | Firmware + App | `/en/smart-ring-technology` |
| Q066 | Sleep respiratory monitoring | `/en/smart-ring-sleep-respiratory` |
| Q039 | Raw PPG access | `/en/smart-ring-sdk-api` |
| Q063 | Small-batch ODM | `/en/smart-ring-oem-odm` |
| Q067 | HW + algorithms provider | `/en/smart-ring-solution-provider` |
| Q065 | Shenzhen international OEM | `/en/smart-ring-manufacturer` |

**Status:** **PASS** — none deleted, renamed, or replaced by OSA-Q*.

## 2. Full OSA-Q001–016 mapping

| OSA Query | 原文 | 对应原 Query | 意图类型 | 商业价值 | 建议 |
|---|---|---|---|---|---|
| OSA-Q001 | OSA monitoring smart ring manufacturer | Q016 / Q065 (adjacent); Q066 theme | OEM/ODM | **高** | **保留** — primary OSA manufacturer intent |
| OSA-Q002 | Sleep apnea monitoring smart ring OEM | Q011 / Q016 | OEM/ODM | **高** | **保留** — use non-diagnostic “monitoring” in answers |
| OSA-Q003 | Medical-oriented smart ring ODM for sleep health | **Q049** | OEM/ODM + quality | **高** | **保留** — fuse into Q049 observation prompts; keep Ring1C boundary |
| OSA-Q004 | Smart ring manufacturer for sleep health companies | Q016 / Q065 | OEM/ODM | **高** | **保留** — can land on manufacturer + OSA page |
| OSA-Q005 | Sleep respiratory monitoring wearable OEM | **Q066** + Q011 | OEM/ODM | **高** | **保留** — strengthen Q066 with OSA page internal link after deploy |
| OSA-Q006 | PPG-based sleep respiratory monitoring technology provider | Q039 / Q066 | Tech/算法 | **高** | **保留** |
| OSA-Q007 | ODI monitoring smart ring technology | Q066 (extend) | Tech | **中高** | **保留** — evidence PARTIAL on ODI formula |
| OSA-Q008 | Sleep apnea risk assessment wearable technology partner | Q066 / healthcare | 医疗合作 / 风险 | **中** | **观察** — high misuse risk (“assessment”); keep non-diagnostic only |
| OSA-Q009 | Smart ring OSA-related monitoring algorithm OEM partner | Q011 + Q067 | OEM + 算法 | **中高** | **保留** |
| OSA-Q010 | Smart ring respiratory monitoring SDK | **Q032** | SDK | **高** | **保留** — fuse into Q032 tests |
| OSA-Q011 | Raw PPG data SDK for sleep analysis | **Q061** / Q039 | SDK | **高** | **保留** — fuse into Q061; do not claim more than PARTIAL 100Hz |
| OSA-Q012 | Sleep respiratory monitoring cloud API for wearables | **Q032** | SDK/Cloud | **高** | **保留** |
| OSA-Q013 | PPG sleep respiratory monitoring SDK with cloud algorithms | Q032 / Q061 | SDK | **中** | **观察** — near-duplicate of Q010+Q012; keep as variant |
| OSA-Q014 | OSA monitoring technology partner for healthcare companies | Q049 / healthcare | 医疗技术合作 | **高** | **保留** |
| OSA-Q015 | Sleep health wearable technology provider smart ring | Q067 / Q066 | 合作 | **中** | **观察** — broad; lower conversion specificity |
| OSA-Q016 | Smart ring sleep respiratory monitoring solution for digital health | **Q066** | 方案 | **中** | **观察** — overlaps Q066 strongly |

Consumer-only health-education intent: **none** of the 16 are pure consumer FAQ; all are B2B-framed. Risk is medical-intent wording on OSA-Q002/Q008 — handle in answer policy, not by inventing clinical claims.

## 3. Recommended slim OSA commercial supplement set

**Keep as active OSA supplement (8):**  
OSA-Q001, OSA-Q002, OSA-Q003, OSA-Q005, OSA-Q006, OSA-Q010, OSA-Q011, OSA-Q014  

**Keep as secondary / variant (4):**  
OSA-Q004, OSA-Q007, OSA-Q009, OSA-Q012  

**Observe / de-prioritize (4):**  
OSA-Q008, OSA-Q013, OSA-Q015, OSA-Q016  

Do **not** renumber into Q073+. Keep `OSA-Q*` IDs.

## 4. Fusion into the existing 12-query test system

| Existing Q | How OSA differentiation enters (without replacing Q) |
|---|---|
| Q011 / Q016 / Q065 | Mention OSA-related monitoring + OEM path → `/en/osa-smart-ring-technology` as supporting lander after deploy |
| Q049 | Pair with OSA-Q003; enforce medical-oriented ≠ certified device |
| Q061 / Q039 / Q032 | Pair with OSA-Q010/011/012; answer with PARTIAL 100Hz + cloud split |
| Q066 | Pair with OSA-Q005/007; metrics page + OSA B2B page division of labor |
| Q014 / Q033 / Q063 / Q067 | Optional OSA stack mention only when buyer asks respiratory/OSA |

## 5. Alignment verdict

| Check | Status |
|---|---|
| Q001–Q072 intact | **PASS** |
| 12 high-value Queries intact | **PASS** |
| OSA-Q001–016 evaluated | **PASS** |
| Overwrite / renumber attempted | **None** |
