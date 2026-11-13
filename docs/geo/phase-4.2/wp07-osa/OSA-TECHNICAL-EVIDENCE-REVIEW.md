# OSA Technical Evidence Review — WP07-REVIEW-001-B

**Audited tip:** `9d16eae`  
**Principle:** Metric **names** in code ≠ clinical validation. No missing evidence upgraded via marketing wording.

## 1. Sources re-checked

- `OSA-TECHNICAL-EVIDENCE-REGISTER.md`, `OSA-OWNER-INPUT-REQUIRED.md`, `OSA-TECHNICAL-CAPABILITY-AUDIT.md`
- `docs/geo/LONGVON-FACTS.md`, `EVIDENCE-MATRIX.md`, `LONGVON_PRODUCT_TECHNICAL_EVIDENCE.md`, `LONGVON_MEDICAL_CLAIMS_BOUNDARY.md`, `LONGVON_PUBLIC_CLAIMS_REGISTER.md`
- `apps/web/lib/health-metrics.ts` (OSA Screening module)
- Ring1C / OSA / SDK / sleep-respiratory pages; `/assessment/osa` STOP-BANG UX

## 2. Mandatory item matrix

| Technical item | Audit status | Evidence basis | Notes |
|---|---|---|---|
| Multi-wavelength PPG | **VERIFIED** (generic) | FACTS #12; Ring1C/product/OSA pages; StructuredData | nm unspecified |
| 525 / 630 / 880 nm | **OWNER_CONFIRMATION_REQUIRED** | Zero repo hits (prior full-repo audit) | Do not publish nm |
| 100Hz PPG | **PARTIALLY_VERIFIED** | C-TECH-03; SDK pages | Partner-qualified; one-pager pending |
| SpO₂ | **VERIFIED** as published monitoring metrics | health-metrics SpO₂ + OSA desat params | Calculation SOP missing |
| ODI | **PARTIALLY_VERIFIED** | Metric names `ODI` / `ODI评分` + ≥3%/≥4% drop params | Exact formula **OWNER_CONFIRMATION_REQUIRED** |
| AHI | **PARTIALLY_VERIFIED** | Metric name `AHI` in health-metrics / FACTS | Not PSG-equivalent; method **OWNER_CONFIRMATION_REQUIRED** |
| Respiratory event recognition | **NOT_VERIFIED** (taxonomy) | Desat counts VERIFIED as metrics; apnea/hypopnea taxonomy absent | Do not invent event classes |
| OSA risk assessment | **PARTIALLY_VERIFIED** | `OSA初筛结果` metric + STOP-BANG **questionnaire** UX | Questionnaire ≠ ring algorithm clinical validation |
| PSG validation | **NOT_VERIFIED** / **BLOCKED** for claims | No study dossiers in repo | Never claim validated |
| STOP-BANG | **VERIFIED** as web questionnaire UX only | `/assessment/osa` | Separate from device metrics |
| Ring1 | **OWNER_CONFIRMATION_REQUIRED** | C-PROD-02/03 UNVERIFIED | No public dossier |
| Ring1C | **VERIFIED** consumer / **not** medical device | C-PROD-01 | Must keep separation |

## 3. End-to-end capability chain

| Stage | Status | Comment |
|---|---|---|
| 1. PPG raw acquisition | **PARTIALLY_VERIFIED** | Multi-λ PPG VERIFIED; 100Hz PARTIAL; formats/channels BLOCKED |
| 2. PPG signal processing | **NOT_VERIFIED** | Internals / SQA / motion artifact docs absent |
| 3. SpO₂ change analysis | **PARTIALLY_VERIFIED** | Published drop counts ≥3%/≥4%; formula depth missing |
| 4. Sleep respiratory event ID | **NOT_VERIFIED** (beyond published labels) | Metric catalogue ≠ event taxonomy |
| 5. ODI-related metrics | **PARTIALLY_VERIFIED** | Name published; convention missing |
| 6. OSA risk assessment | **PARTIALLY_VERIFIED** | 初筛 metric + STOP-BANG UX; non-diagnostic |
| 7. SDK / Cloud API service | **PARTIALLY_VERIFIED** | Project-scoped; cloud dependency disclosed; no public portal |
| 8. Hardware / firmware / manufacturing | **VERIFIED** / soft PARTIAL | OEM/ODM models VERIFIED; ISO13485-oriented soft |

**Do not treat roadmap diagrams as shipped clinical/regulatory capability.**

## 4. Register consistency check

WP07 evidence register (OSA-E-01…E-21) remains consistent with Claims Register C-MED-01/02/03 and C-TECH-02/03.  
Cross-check additions (STOP-BANG OSA-E-18; zero nm hits OSA-E-20; Hero soft line OSA-E-21) are correctly non-clinical.

## 5. Owner confirmation backlog (evidence only)

See `OSA-OWNER-INPUT-REQUIRED.md` items 1–16 and `WP07-OWNER-DECISIONS.md`.  
**No evidence gap may be closed by copy edits alone.**
