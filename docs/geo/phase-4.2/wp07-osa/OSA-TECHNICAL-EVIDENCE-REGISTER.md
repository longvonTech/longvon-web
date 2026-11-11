# OSA Technical Evidence Register — WP07

Generated (UTC): 2026-11-11T14:10:00Z

| Claim ID | Exact claim | Source | Evidence quality | Status | Publishable? | Extra evidence needed |
|---|---|---|---|---|---|---|
| OSA-E-01 | 71 total / 22 sleep-related parameters | FACTS #9; health-metrics totals | Strong | VERIFIED | YES | — |
| OSA-E-02 | OSA Screening module with 20 published parameters including AHI, ODI, OSA初筛 | `apps/web/lib/health-metrics.ts` | Strong (metric list) | VERIFIED | YES with non-diagnostic disclaimer | Algorithm whitepaper |
| OSA-E-03 | SpO₂ drop ≥3% / ≥4% counts & duration | health-metrics OSA params | Strong (names) | VERIFIED | YES as monitoring metrics | Event definition SOP |
| OSA-E-04 | AHI / ODI / SpO₂ as published monitoring metrics | FACTS #11; Evidence Matrix | Strong | VERIFIED | YES non-diagnostic | Validation dossier |
| OSA-E-05 | Multi-wavelength PPG + temp + 6-axis (Ring1C) | FACTS #12; product pages | Strong | VERIFIED | YES | Wavelength nm sheet |
| OSA-E-06 | PPG wavelengths 525/630/880 nm | — | None in repo | UNVERIFIED | NO until owner | Optical BOM / datasheet |
| OSA-E-07 | 100Hz raw PPG for qualified partners | SDK pages; C-TECH-03 | Medium | PARTIAL | Soft yes | Technical one-pager |
| OSA-E-08 | Partner SDK + Cloud API project-scoped | SDK pages | Medium | PARTIAL | Soft yes | SDK doc index |
| OSA-E-09 | Cloud algorithm dependency for many metrics | SDK pages | Strong boundary | VERIFIED | YES | Per-metric matrix |
| OSA-E-10 | Ring1C not a medical device | C-PROD-01; product pages | Strong | VERIFIED | YES mandatory | — |
| OSA-E-11 | Ring1 medical registration | — | None | UNVERIFIED | NO | Dossier |
| OSA-E-12 | Clinical accuracy / PSG correlation / sens-spec | — | None | BLOCKED | NO | Study protocol+results |
| OSA-E-13 | FDA/CE/NMPA product approval for OSA function | Evidence Matrix | None | BLOCKED | NO | Certificates |
| OSA-E-14 | Exact ODI calculation convention | — | None | UNVERIFIED | Soft metric name only | Spec |
| OSA-E-15 | Full apnea/hypopnea event recognition taxonomy | — | None beyond metric names | UNVERIFIED | NO detailed taxonomy | Algorithm design doc |
| OSA-E-16 | ISO 13485–oriented quality / cleanroom soft claims | Trust pages | Soft | PARTIAL | Soft oriented only | Certs/photos |
| OSA-E-17 | OEM/ODM manufacturing + cooperation models | Commercial pages | Strong | VERIFIED | YES | — |
| OSA-E-18 | STOP-BANG–style OSA **risk screening** web UX | `apps/web/app/assessment/osa/page.tsx`; assessment hub; homepage copy | Strong as **product UX** | VERIFIED (UX only) | YES only as questionnaire risk tool — **not** device clinical validation | Do not equate to PSG/device clearance |
| OSA-E-19 | “OSA初筛结果” + AI sleep-respiratory suggestion metric names | `health-metrics.ts` | Strong as catalogue names | VERIFIED (names) | Soft yes non-diagnostic | Algorithm / clinical dossiers |
| OSA-E-20 | Exact PPG wavelengths 525 / 630 / 880 nm | Full-repo audit (zero hits for those nm strings) | None | UNVERIFIED / MISSING | **NO** | Optical BOM (same as OSA-E-06) |
| OSA-E-21 | Soft marketing “专为睡眠呼吸暂停筛查…” hero line | `apps/web/components/HeroSection.tsx` | Soft marketing | PARTIAL | Existing site language — keep aligned with medical boundary; prefer “OSA-related / risk reference” on B2B OSA page | Owner copy hygiene |

**Cross-check (2026-11-11):** Independent repo audit confirms: wavelengths **absent**; 100Hz/SDK **PARTIAL**; Ring1 **UNVERIFIED**; no clinical study / FDA–CE–NMPA dossier files; usable stack is published metrics + medical-boundary framing only.
