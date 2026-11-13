# WP07 Owner Decisions — WP07-REVIEW-001

**Rule:** Reviewer must not make final decisions for the LONGVON project owner. Options and recommendation only.

| ID | Decision | Background | Options | Reviewer recommendation | Blocks |
|---|---|---|---|---|---|
| D-01 | Approve “medical-oriented / medical-grade” public framing | Pages use “medical-oriented” + FAQ explaining medical-grade ≠ product approval. Evidence is ISO13485-oriented soft claims only. | A) Keep current clarified wording · B) Replace with safer “healthcare-oriented” EN / 「医疗健康向」ZH · C) Allow headline “medical-grade” only with extra disclaimer | Prefer **B** or clarified **A**; avoid C without certs | **Deploy** |
| D-02 | Approve production deploy of `/en/osa-smart-ring-technology` + ZH | Implemented, SSR-tested, **not live**. SDK prod historically 404 until CGE deploy. | A) Deploy OSA with SDK · B) Deploy SDK first then OSA · C) Hold both | Prefer **B** then OSA, or **A** same release train | **Deploy** |
| D-03 | Confirm PPG wavelengths (incl. 525/630/880 nm) per SKU | Mission hypothesis; zero repo evidence | A) Supply BOM/datasheet · B) Written “do not publish nm” | Supply under NDA or choose B | Public nm claims |
| D-04 | Supply 100Hz PPG partner one-pager | C-TECH-03 PARTIAL | A) Provide format/channels/license note · B) Keep soft “pathways” only | A before aggressive Q061 campaigns | SDK credibility |
| D-05 | Confirm ODI definition (≥3%/≥4%, duration, window) | Metric names exist; formula absent | A) Spec · B) Keep name-only non-diagnostic | A if selling ODI depth | ODI depth claims |
| D-06 | Confirm AHI method + research vs product scope | AHI name published | A) Spec + labeling · B) Soft monitoring metric only | B until A | PSG-equivalence risk |
| D-07 | Clinical/PSG dossiers exist? | None in repo | A) Provide · B) Written “none public” | B unless dossiers exist | Clinical claims |
| D-08 | Ring1 regulatory summary by market | UNVERIFIED | A) Dossier · B) Silence on Ring1 registration | Silence until A | Ring1 claims |
| D-09 | Cite STOP-BANG web tool on B2B OSA page? | UX exists; not device validation | A) Mention as separate questionnaire · B) Omit from OSA B2B page | **B** or carefully separated A | Confusion risk |
| D-10 | Hero soft “睡眠呼吸暂停筛查” hygiene | Existing site marketing | A) Soften sitewide · B) Leave · C) Align only new pages | Soften when touching homepage | Consistency |
| D-11 | Merge PR order | #11 stacked on #10 | A) Merge #10 then #11 · B) Squash/restack differently | **A** | Process integrity |
| D-12 | Approve six OSA content drafts for publish | `content/01–06` are drafts | A) Publish subset · B) Hold all | Hold until D-01/D-02 | Content publish |
| D-13 | Slim OSA query set for observation | 16 OSA-Q evaluated | A) Use 8 active recommended · B) Keep all 16 | **A** (see OSA-QUERY-MAPPING) | Test bandwidth |
| D-14 | CI / checks policy for #10/#11 | `gh pr checks` empty at audit time | A) Require green CI before merge · B) Accept local WP07 evidence | Prefer A if CI exists; else document exception | Merge readiness |

**No decision above is auto-executed by this review.**
