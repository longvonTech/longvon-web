# WP07 OSA Execution Report — LONGVON-GEO-P42-WP07-001

Generated (UTC): 2026-11-11T14:40:00Z · Local label: 2026-11-11 22:40 Asia/Shanghai  
Parent: LONGVON-GEO-P42-CGE-001  
Branch: `cursor/geo-wp07-osa-fc31`  
Latest commit: `1027e4dc9c1c59da4fc8078e23fb4ebdb46f072e`  
Production deploy: **NOT performed**  
WP07 / Phase 4.2 full completion: **NOT claimed** (evidence & approvals outstanding)

## 1. Executive summary

WP07 converts LONGVON’s **evidenced** sleep respiratory / OSA-related monitoring stack into a B2B commercial differentiation packet without fabricating clinical or regulatory claims.

**Verified commercially usable core:** published OSA Screening metric module (incl. ≥3%/≥4% SpO₂ drops, ODI, AHI monitoring metrics, OSA screening label), multi-wavelength PPG + temp + 6-axis on Ring1C basis, partner SDK/Cloud boundaries (incl. PARTIAL 100Hz), OEM/ODM cooperation models, Ring1C **not** a medical device.

**Not verified in repo:** PPG nm (525/630/880), exact ODI/AHI formulas, apnea event taxonomy internals, clinical PSG validation, product medical approvals, Ring1 dossier.

**Implemented not deployed:** `/en/osa-smart-ring-technology` + ZH twin as B2B entry (distinct from existing metrics page `/en/smart-ring-osa`).

## 2. Workstream status

| ID | Status |
|---|---|
| WP07-A Capability audit | COMPLETED |
| WP07-B Architecture | COMPLETED |
| WP07-C Competitor intel | COMPLETED (public sources) |
| WP07-D Query cluster OSA-Q001–016 | COMPLETED |
| WP07-E Commercial page EN/ZH | IMPLEMENTED NOT DEPLOYED |
| WP07-F Six content drafts | REVIEW (owner publish) |
| WP07-G Integration | COMPLETED |
| WP07-H Medical claims review | COMPLETED |
| Implementation/tests | COMPLETED locally |

## 3. Files inspected (key)
LONGVON-FACTS, EVIDENCE-MATRIX, PROCUREMENT library, PRODUCT technical evidence, MEDICAL claims boundary, Claims Register, health-metrics.ts, geo.ts, Ring1C/OSA/SDK/sleep-respiratory pages, CGE-001 competitor/query packets.

## 4. Evidence discovered vs missing
See `OSA-TECHNICAL-EVIDENCE-REGISTER.md` and `OSA-OWNER-INPUT-REQUIRED.md`.

## 5. Competitor findings (commercial)
Belun/Samsung lead on **regulated screening/HSAT evidence**; Circul on **ODI literature**; RingConn on **consumer OSA insights**; OEM peers on **SDK/MOQ landers**. LONGVON’s defensible angle is **full stack technology + manufacturing partner** with honest non-diagnostic OSA metrics — not claiming Belun-equivalent FDA HSAT without dossiers.

## 6. Query priorities
P0: OSA-Q001,002,003,004,005,006,007,010,011,012,014. Namespace does not overwrite Q001–Q072.

## 7. Build/test
Build PASS; SSR 200 for new OSA commercial routes; i18n tests PASS. Evidence: `evidence/ssr-smoke-wp07.txt`.

## 8. Outstanding blockers / owner decisions
1. Optical wavelength confirmation  
2. ODI/AHI algorithm definitions + any validation dossiers  
3. Approve “medical-grade” headline framing scope  
4. Approve production deploy of OSA commercial pages  
5. Approve content draft publication  
6. Ring1 matrix/regulatory summary  

## 9. Recommended next commercial action
1. Owner review medical-grade wording + deploy `/en/osa-smart-ring-technology`.  
2. Supply 100Hz PPG + ODI definition one-pagers.  
3. Target P0 OSA-Q Queries in human AI/SERP observations.  
4. Keep SDK deploy (CGE-001) sequenced with OSA page for conversion path completeness.
