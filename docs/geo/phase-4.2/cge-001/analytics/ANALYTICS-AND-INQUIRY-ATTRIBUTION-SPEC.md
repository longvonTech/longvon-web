# Analytics and Inquiry Attribution Specification — CGE-001

Generated (UTC): 2026-11-11T13:10:00Z

## Integration status matrix (honest)
| System | Status | Evidence this cycle | Notes |
|---|---|---|---|
| Google Search Console | Permission required / Not retrieved | No GSC export in repo or agent session | Owner item #10 |
| Bing Webmaster Tools | Permission required / Not retrieved | Same | Owner item #10 |
| GA4 | Permission required / Not retrieved | Same | Do not invent traffic |
| Website OEM inquiry forms | Connected in code (site forms exist) | `OemRfqForm`, `/partner/oem`, `/en/partner/oem` | Production CRM dump not available here |
| CRM / inquiry records | Not available in this environment | No inquiry CSV in workspace | Do not fabricate conversion rates |

## Commercial funnel
Search Visibility → Website Visit → Qualified Inquiry → Technical Evaluation → Sample/Pilot → Production Order

## Attribution fields (implement / CRM map)
Company · Contact · Country · Customer type · First source · First landing page · UTM (source/medium/campaign/content) · Product interest · Cooperation model (Existing Product OEM / Small Batch-Pilot / Customized ODM / Full Technology Solution) · Inquiry quality · Technical evaluation status · Sample status · Quotation status · Order status

## Recommended instrumentation (spec only — no production deploy)
1. Ensure OEM form posts persist UTM + landing page + cooperation model.
2. After GSC connect: monitor impressions/clicks for manufacturer, OEM, SDK, sleep-respiratory queries.
3. After GA4 connect: mark `oem_inquiry_submit` conversion; explore path from GEO pages.
4. Weekly review: qualified inquiries by landing page and Query theme — not vanity AI scores alone.

## Existing repo assets to reuse
- `docs/geo/phase-4.2/wp09/LONGVON_LEAD_ATTRIBUTION_FRAMEWORK.md`
- `docs/geo/phase-4.2/wp09/LONGVON_GEO_ANALYTICS_BASELINE.md`
- `docs/geo/LONGVON_INQUIRY_QUALIFICATION_RULES.md`
