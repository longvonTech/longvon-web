# OSA Technical Capability Audit — LONGVON-GEO-P42-WP07-001

Generated (UTC): 2026-11-11T14:10:00Z · Local: 2026-11-11 22:10 Asia/Shanghai

**Sources inspected (non-exhaustive):**  
`docs/geo/LONGVON-FACTS.md`, `EVIDENCE-MATRIX.md`, `LONGVON-PROCUREMENT-EVIDENCE-LIBRARY.md`, `phase-4.2/wp02/LONGVON_PRODUCT_TECHNICAL_EVIDENCE.md`, `LONGVON_MEDICAL_CLAIMS_BOUNDARY.md`, `LONGVON_PUBLIC_CLAIMS_REGISTER.md`, `apps/web/lib/health-metrics.ts`, `apps/web/lib/geo.ts`, `apps/web/app/en/smart-ring-osa/page.tsx`, `apps/web/app/en/smart-ring-sleep-respiratory/page.tsx`, `apps/web/app/en/smart-ring-sdk-api/page.tsx`, `apps/web/app/en/products/ring1c/page.tsx`, `docs/geo/phase-4.2/wp05/*`.

**Method:** Evidence-first. No undocumented wavelengths, clinical stats, or regulatory approvals invented.

## Stage 1 — Raw Physiological Signal Acquisition

| Capability | Status | Evidence | Notes |
|---|---|---|---|
| Multi-wavelength PPG (generic) | VERIFIED | Ring1C/product pages; OSA page “Multi-wavelength PPG”; FACTS #12 | Exact nm not in repo |
| PPG wavelengths 525 / 630 / 880 nm | UNVERIFIED | — | Mission hypothesis only; **owner confirm** |
| Sampling frequency 100Hz raw PPG for partners | PARTIAL | SDK pages; Claims C-TECH-03; Product technical evidence | Partner-qualified; technical pack pending |
| Temperature sensing | VERIFIED | FACTS #12; Ring1C | Ring1C basis |
| 6-axis motion | VERIFIED | FACTS #12; Ring1C | Motion artifact context |
| Raw data access via partner SDK | PARTIAL | SDK commercial pages | Project-scoped; no public portal |
| Signal channels / data formats / BLE packet layout | BLOCKED | No SDK protocol docs in repo | Owner technical pack |
| Identical raw exposure on all SKUs | UNVERIFIED | — | Do not assume Ring1 = Ring1C |

## Stage 2 — Signal Processing & Feature Extraction

| Capability | Status | Evidence | Notes |
|---|---|---|---|
| Heart rate / HR trends | VERIFIED | `health-metrics.ts` heart-rate + sleep modules | Published metrics |
| SpO₂-related measurements | VERIFIED | SpO₂ category + OSA module SpO₂ stats | Non-diagnostic |
| HRV / stress-related features | PARTIAL | Stress module uses HRV-related wording | Implementation depth not documented |
| Sleep staging features (REM/light/deep/wake) | VERIFIED | Sleep quality 22 params list | Consumer monitoring |
| Signal quality / motion artifact handling detail | UNVERIFIED | — | Engineering docs missing |
| Planned-only features | NOT IMPLEMENTED | — | None claimed without evidence |

## Stage 3 — Sleep Respiratory Monitoring

| Capability | Status | Evidence | Notes |
|---|---|---|---|
| Overnight SpO₂ event statistics | VERIFIED | OSA module: ≥3% / ≥4% drop counts & duration | Published parameter names |
| Respiratory rate range/average | VERIFIED | OSA module parameters | |
| Heart rate overnight stats tied to OSA module | VERIFIED | OSA module | |
| Body-movement trends | VERIFIED | OSA module `体动量趋势` | |
| Event taxonomy beyond published labels | UNVERIFIED | — | Do not invent apnea/hypopnea taxonomy |
| Failure conditions / signal loss rules | BLOCKED | — | Owner algorithm docs |

## Stage 4 — Respiratory Event Recognition

| Capability | Status | Evidence | Notes |
|---|---|---|---|
| Published SpO₂ desaturation event counts (≥3%, ≥4%) | VERIFIED | `health-metrics.ts` OSA Screening params | Counts/duration outputs |
| Full apnea/hypopnea event classification | UNVERIFIED | AHI listed as metric but no event-level taxonomy docs | Owner confirm |
| Event duration/frequency calculation internals | BLOCKED | — | Algorithm design docs needed |
| Validation status per event type | BLOCKED | No clinical validation files in repo | |

## Stage 5 — ODI Analysis

| Capability | Status | Evidence | Notes |
|---|---|---|---|
| ODI as published monitoring metric | VERIFIED | FACTS #11; Evidence Matrix; `health-metrics.ts` `ODI`, `ODI评分` | Non-diagnostic |
| Desaturation thresholds referenced in product metrics | VERIFIED | ≥3% and ≥4% drop parameters | Does **not** alone prove ODI formula |
| Exact ODI definition (threshold, duration, window) | UNVERIFIED | — | Owner algorithm/spec required |
| Validation vs PSG ODI | BLOCKED | No study report in repo | |

## Stage 6 — OSA Risk Assessment / AHI-related

| Capability | Status | Evidence | Notes |
|---|---|---|---|
| “OSA初筛结果” published metric name | VERIFIED | `health-metrics.ts` | Framed as 初筛参考 / health reference |
| AHI as published monitoring/research metric | VERIFIED | FACTS #11; OSA pages | **Not** PSG-equivalent claim |
| AI sleep respiratory health assessment suggestions | PARTIAL | Parameter `AI睡眠呼吸健康评估及建议` | Soft product feature name |
| Clinically validated AHI vs PSG | BLOCKED | Evidence Matrix bans clinical stats | No study dossier in repo |
| Approved medical-device OSA function | NOT IMPLEMENTED (public) | Ring1C = not medical device | Ring1 dossier UNVERIFIED |
| Diagnose/treat OSA / replace PSG | BLOCKED (forbidden) | Medical claims boundary | Never publish |

## Stage 7 — SDK / Cloud API / Integration

| Capability | Status | Evidence | Notes |
|---|---|---|---|
| Partner SDK (project-scoped) | PARTIAL | SDK pages; Claims C-TECH-04 | No public download |
| 100Hz PPG pathway | PARTIAL | SDK pages | Soft yes |
| Cloud algorithm dependency | VERIFIED (boundary) | SDK pages disclose cloud dependency | Many metrics cloud-served |
| Customer-owned App integration discussion | PARTIAL | SDK FAQ | Project evaluation |
| Separate licensing: SDK / algo / support / cloud | VERIFIED (commercial framing) | CGE-001 SDK page updates | |
| Full offline all algorithms | BLOCKED | Forbidden claim | |
| Unrestricted BLE protocol | BLOCKED | Forbidden claim | |

## Stage 8 — Product & Manufacturing

| Capability | Status | Evidence | Notes |
|---|---|---|---|
| Ring1C consumer reference | VERIFIED | Product pages; Claims C-PROD-01 | Not medical device |
| Ring1 regulatory / SKU matrix | UNVERIFIED | Claims C-PROD-02/03 | Owner |
| Ring1 Titanium | UNVERIFIED | Mentioned in mission; not evidenced in core FACTS | Owner |
| OEM/ODM + four cooperation models | VERIFIED / PARTIAL | Commercial pages + COOPERATION_MODES_* | |
| ISO 13485–oriented / cleanroom soft claims | PARTIAL | Trust bullets; Claims | Not certified absolute |
| Medical vs consumer line isolation | PARTIAL | Company trust copy | Soft |

## Summary counts
VERIFIED / PARTIAL / UNVERIFIED / BLOCKED / NOT IMPLEMENTED as above — see Evidence Register for claim IDs.
