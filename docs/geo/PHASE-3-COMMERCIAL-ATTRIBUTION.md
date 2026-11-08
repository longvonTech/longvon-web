# PHASE-3 Commercial Attribution (AI → OEM)

**Status:** 规则与漏斗已开发 / 真实 KPI **N/A** / 未宣称 GEO 已产生订单

## F1. Existing systems (read-only inventory)

| System | Present? | Access this phase |
|---|---|---|
| GA4 | No code evidence in repo | N/A |
| GTM | No code evidence | N/A |
| GSC | Account unverified | N/A |
| Bing Webmaster | Account unverified | N/A |
| G5 first-touch | Deployed per 2026-11-01 records; `LeadAttributionCapture` on prod layout | Read-only; **no G5 production flow changes** |
| CRM / Admin commercial stages | Endpoints documented; sales ledger not verified current | N/A for live funnel counts |
| Website RFQ (`OemRfqForm`) | Production form protected (denylist) | No behavior changes |

## F2. First-touch channels

Canonical channel set for reporting:

1. Google Organic  
2. Bing Organic  
3. ChatGPT  
4. Gemini  
5. Perplexity  
6. Doubao  
7. Direct  
8. Referral  
9. Other  

Rules:
- Prefer first-touch over last-click for AI discovery narratives.
- Pageviews alone ≠ RFQ ≠ Qualified Lead.
- G5-SMOKE / test submissions are excluded from commercial KPIs.

## F3. Funnel definitions

| Stage | Definition |
|---|---|
| Visit | Session landing on site (any page) |
| OEM page | View `/partner/oem` or `/en/partner/oem` |
| RFQ | Successful OEM form submit (non-smoke) |
| Qualified Lead | Sales marks QUALIFIED within policy (target ≤48h) with reason |
| Unqualified Lead | Explicit LOST/UNQUALIFIED with reason |
| Sample Requested | Sample requested in CRM/order process |
| Sample Paid | Sample payment confirmed |
| Order Confirmed | Batch/PO confirmed |
| Lost | Closed-lost after qualification path |

## F4. KPI board (current period)

| KPI | Value |
|---|---|
| AI Referral Sessions | N/A |
| AI Referral RFQ | N/A |
| Qualified OEM Leads | N/A |
| Sample Orders | N/A |
| Confirmed OEM Orders | N/A |
| AI Referral Conversion Rate | N/A |
| OEM page conversion rate | N/A |
| Lead quality by AI platform | N/A |

Known non-KPI: 2026-11-01 G5-SMOKE first-touch — test only.

## F5. 7 / 14 / 30 day report templates

Use only **after** an authorized production release of FIX-01 (or other GEO change). Until then leave blank/N/A and do not start the clock.

### Template

| Window | AI sessions | AI RFQ | Qualified | Samples | Orders | Notes / confounders |
|---|---|---|---|---|---|---|
| Day 0 baseline | N/A | N/A | N/A | N/A | N/A | Pre-release |
| +7d | | | | | | Technical crawl checks first |
| +14d | | | | | | Re-run 60-query consumer sample |
| +30d | | | | | | Separately discuss causality vs correlation |

Confounders to record: ads, offline sales, directory listings, CSDN posts, seasonality, sales outbound.
