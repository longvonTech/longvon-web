# PHASE-4.1 Day 0 Baseline Report

**Day 0 date:** 2026-11-08 (post GEO-FIX-01 Phase 3.0.0 production deploy)  
**Generated (UTC):** 2026-11-08T15:23:23Z  
**Nature:** Effect measurement only — **no website content changes**  
**Deploy reference:** `GEO-FIX-01-PRODUCTION-DEPLOYMENT-REPORT.md` (`DEPLOYED — ALL CHECKS PASSED`)

## Executive answers

| # | Question | Answer |
|---|---|---|
| 1 | AI already know LONGVON? | **N/A** for clean Day 0 consumer UI (0/240 cells captured). Historical contaminated/API samples must not be used as Day 0 proof. |
| 2 | Recognized as smart-ring OEM/ODM manufacturer? | **N/A** (no clean consumer captures this round). |
| 3 | Best platform? | **N/A** — no scored consumer results. |
| 4 | Which commercial questions still miss LONGVON? | **N/A** until Day 0 consumer capture completes; full Q001–Q060 bank retained for testing. |
| 5 | Official site used as AI citation? | **N/A** for AI answers. Technically, official pages now emit correct EN `lang` + Meta (145/152) which are crawl prerequisites. |
| 6 | Confirmable improvements from this deploy? | **YES (technical):** EN Manufacturer/OEM `html lang=en`; Meta 145/152 exact approved text; hreflang/x-default present; JSON-LD present; Contact nginx 301 intact; homepage `zh-CN`. See §Technical verification. |
| 7 | What to watch in Day+7? | Re-crawl of Manufacturer/OEM Meta & lang in Bing/GSC if access granted; first clean consumer 60×4 sample; whether AI begins citing `longvon.com`; OEM RFQ/G5 first-touch quality (CRM N/A until access). |

## Scope & integrity rules followed

- Reused Phase 3 fixed Q001–Q060 wording — **not rewritten**.
- Consumer UI vs API separated; **no API results presented as consumer**.
- **No fabricated platform answers**.
- Gemini API **not called**.
- Historical baseline files **not overwritten**.
- Production site / FIX-01 payload / dirty workspace **not modified**.

## Platform access probes (evidence, not scored answers)

| Platform | Probe result | Evidence |
|---|---|---|
| ChatGPT | Login wall / send disabled for reliable automated clean capture | `phase-4.1-day0-evidence/screenshots/phase41-chatgpt-access.png` |
| Gemini | Login CTA; API forbidden | `.../phase41-gemini-access.png` |
| Perplexity | Cloudflare human check blocked | `.../phase41-perplexity-access.png` (Ray `a57591f9bdf5896b`) |
| 豆包 | UI reachable; login/download interstitial; no authorized capture run | `.../phase41-doubao-access.png` |

Full probe JSON: `docs/geo/phase-4.1-day0-evidence/access-probes/platform-access.json`

## GEO 60 × 4 capture status

| Metric | Value |
|---|---|
| Query bank | 60 (Q001–Q060) |
| Platforms | 4 |
| Total cells | 240 |
| Captured consumer answers | **0** |
| N/A cells | **240** |
| Simulated answers | **0** |

Artifacts:
- `docs/geo/PHASE-4.1-DAY-0-GEO-60-CAPTURE.csv`
- `docs/geo/PHASE-4.1-DAY-0-RAW-ANSWERS.json`
- `docs/geo/PHASE-4.1-DAY-0-SCORE-MATRIX.csv`
- `docs/geo/PHASE-4.1-DAY-0-PLATFORM-SUMMARY.json`
- `docs/geo/PHASE-4.1-DAY-0-CATEGORY-SUMMARY.json`

### Platform summary

| Platform | Captured | Mention rate | Avg score | Status |
|---|---|---|---|---|
| ChatGPT | 0/60 | N/A | N/A | N/A — login wall |
| Gemini | 0/60 | N/A | N/A | N/A — login / no API |
| Perplexity | 0/60 | N/A | N/A | N/A — Cloudflare |
| Doubao | 0/60 | N/A | N/A | N/A — no authorized capture |

### Category summary

| Category | IDs | Captured cells | Notes |
|---|---|---|---|
| Manufacturer Discovery | Q001–Q010 | 0/40 | N/A |
| OEM/ODM | Q011–Q020 | 0/40 | N/A |
| Health Monitoring | Q021–Q030 | 0/40 | N/A |
| SDK/API | Q031–Q040 | 0/40 | N/A |
| International Buyers | Q041–Q050 | 0/40 | N/A |
| Competitor Comparison | Q051–Q060 | 0/40 | N/A |

## Technical verification (read-only, live)

Checked at: `2026-11-08T15:21:14Z` against `https://www.longvon.com`

| Surface | HTTP | lang | Meta chars | hreflang zh/en/x-default | JSON-LD | Result |
|---|---|---|---|---|---|---|
| `/` | 200 | `zh-CN` | 105 | PASS | 4 | PASS lang zh-CN |
| `/en/smart-ring-manufacturer` | 200 | `en` | **145** | PASS | 4 | PASS Meta 145 + en |
| `/en/partner/oem` | 200 | `en` | **152** | PASS | 6 | PASS Meta 152 + en |
| `/contact` | 301 → `https://www.longvon.com/partner/oem` | — | — | — | — | PASS |

Evidence files:
- `docs/geo/phase-4.1-day0-evidence/technical-verification.json`
- `docs/geo/phase-4.1-day0-evidence/pages/*.html`
- `docs/geo/phase-4.1-day0-evidence/headers/*.txt`

**Overall technical Day 0 gate:** `PASS`

### Search / analytics / CRM

| System | Day 0 |
|---|---|
| Google Search Console | N/A — no authorized read-only property access in this session |
| Bing Webmaster | N/A — no authorized read-only property access in this session |
| GA4 | N/A — no GA4/gtag evidence in deploy surface; no console access |
| CRM conversions | N/A — no CRM read access this phase |

No index submission or site-config changes performed.

## Historical baseline comparison (preserved, not overwritten)

| Dataset | Directly comparable to Day 0 clean consumer? | Use |
|---|---|---|
| 2026-11-01 API 20-sample | **No** | Method differs (API, no web search) |
| Prior ChatGPT consumer (contaminated) | **No** | Memory/custom-instruction pollution |
| Phase 3 worksheet (captures N/A) | Structure only | Same Q-bank lineage |
| **This Day 0 consumer packet** | **Yes (when filled)** | Future +7/+14 comparisons |

Do **not** claim AI-visibility uplift from FIX-01 until clean consumer Day 0 and Day+7 scores exist.

## Confirmable deploy improvements (non-AI)

Relative to pre-deploy live HTML (Phase 3 audit: EN pages `lang=zh-CN`, Meta 189/334):

1. EN Manufacturer & OEM now `lang="en"`.  
2. Meta descriptions now approved 145 / 152 strings.  
3. hreflang + x-default link tags present on both pages.  
4. JSON-LD blocks present.  
5. Contact → OEM nginx 301 preserved.  
6. Homepage remains `zh-CN`.

These are **technical/crawl-signal** improvements, not proof of AI recommendation lift.

## Next actions for Day+7

1. Owner-authorized **human** clean-session capture of Q001–Q060 × 4 platforms (or subset prioritized: OEM/ODM + Manufacturer first).  
2. Grant read-only Bing/GSC exports for Manufacturer & OEM URLs.  
3. Re-run this technical verification checklist.  
4. Compare only like-for-like consumer scores; keep API track separate.  
5. Watch OEM page → RFQ if CRM access appears; still exclude smoke tests.

## Deliverable index

1. `PHASE-4.1-DAY-0-BASELINE-REPORT.md` (this file)  
2. `PHASE-4.1-DAY-0-GEO-60-CAPTURE.csv`  
3. `PHASE-4.1-DAY-0-RAW-ANSWERS.json`  
4. `PHASE-4.1-DAY-0-SCORE-MATRIX.csv`  
5. `PHASE-4.1-DAY-0-PLATFORM-SUMMARY.json`  
6. `PHASE-4.1-DAY-0-CATEGORY-SUMMARY.json`  
7. `phase-4.1-day0-evidence/` (technical + access screenshots)

**Day 0 AI visibility score:** N/A (0 real consumer answers)  
**Day 0 technical post-deploy verification:** PASS  
