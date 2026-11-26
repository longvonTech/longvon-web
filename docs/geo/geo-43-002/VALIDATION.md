# GEO-43-002 technical validation

2026-11-25 final repair validation: 24/24 contracts, 5/5 i18n, full Web build and all six EN/ZH OEM plus two retained PPG browser paths pass locally on the approved Ring1/Ring1C standard-OEM policy. The previous ff789513 buyer-path failure was a stale numeric-policy test, not a reason to withdraw the approved 1,000-unit MOQ. Only the two test files are repaired; application and policy sources remain unchanged.

Public policy approval is established: 1,000 units applies only to existing Ring1/Ring1C standard OEM; configuration/pricing are separately confirmed, custom ODM separately evaluated and no internal pilot quantity published. Independent PR review and separate deployment approval are still required.

Full failure log, new isolated evidence and scope verification: `evidence/pr24-final-20261125/`. See [PR24-FINAL-ACCEPTANCE.md](PR24-FINAL-ACCEPTANCE.md) for root cause, reused PR29 fix and integration compatibility. Current four-check remote acceptance is recorded in the [PR24 Checks](https://github.com/longvonTech/longvon-web/pull/24/checks) and final PR description for the same latest SHA; cb1bc6c's old green checks are not used as proof of this repair.

- Unit/contracts:24/24, retaining previous PPG and RFQ contracts.
- Existing i18n tests:5/5.
- Web lint and full build:exit0; unrelated existing admin hook warnings retained.
- Final standalone: EN/ZH OEM pagesHTTP200 with one H1, reciprocal canonical/hreflang and visible FAQ/schema agreement.
- Six paths: three real clickable stage CTAs in each language through the actual RFQ handler into intercepted synthetic transport.
- Optional qualification fields preserved within remark; no new DTO property. Contact/market/timing, international phone, first/latest UTM content/term and AI/interest preserved.
- Oversized-note input:zero POSTs, explicit error. API500:email fallback, no success event. Retry after simulated failure succeeds locally without a second start event.
- QA/local/test markers never reach commercial analytics. Explicit test classification persists across navigation. Honeypot acknowledgements are not success events. No raw identity or free text in telemetry.
- Existing PPG buyer-path regression:both locales pass with new optional fields blank, no page errors.
- Eight contextual entry links valid; each OEM sitemap URL once, no fragment indexed route.
- Desktop1440px and mobile390px journey/RFQ screenshots, no horizontal overflow.
- ProductionPOSTs0; no SQL writes or WeCom calls. Original production-before evidence remains historical public GET-only; the 2026-11-25 repair run uses only the local standalone and no production requests. Synthetic quantities in form screenshots/payloads are test buyer estimates, not MOQ policy.

The first harness negative-error locator matched Next's route announcer as well as the form alert; it was scoped to the form without dropping the validation assertion. Actual app/client failures are not represented as passes.

Backend, model, notification implementation, attribution storage, international phone/keyword contract and production workflow are unchanged (integrity.json). This is transport-intercepted front-end regression, not a new production/SQL/notification acceptance test. No test or required-field coverage was lowered.

The expanded existing GEO CI also retains the full prior PPG suite. The current remote check results and approved limited commercial scope are recorded in the PR; no numeric source/applicability approval remains pending. No merge/deployment is permitted here.
