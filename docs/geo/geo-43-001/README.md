# GEO-43-001 — 100Hz raw PPG buyer pathway

Status: feature branch for independent review only. Issue: https://github.com/longvonTech/longvon-web/issues/21.
Base: main `01564a4a7dbcff6c15c00349e28ede5407fbeac5`. No merge, production deployment, database operation or real RFQ submission is authorized by this issue.

## Information architecture

Expand the existing SDK page, rather than create a second indexable page with substantially overlapping access/SDK/cloud content:

- EN: https://www.longvon.com/en/smart-ring-sdk-api#100hz-raw-ppg
- ZH: https://www.longvon.com/smart-ring-sdk-api#100hz-raw-ppg

Canonical URLs remain the fragment-free SDK pair. Both already exist in `GEO_PAGE_SLUGS`, `EN_ROUTE_MAP` and sitemap generation. No duplicate route or sitemap URL is added. The shared section adds buyer evaluation questions, an SDK/cloud responsibility split, discovery/NDA/SOW inputs and a technical consultation CTA. The rest of the existing SDK content and medical/commercial boundaries remain.

This issue does not establish an approved Tony commercial knowledge base. Historical documents marked REVIEW/PARTIAL remain that way. We retain only the qualified access discussion already in the published baseline and the owner's cautious-wording decision; no technical pack, commercial price or new entitlement is invented.

## Audit and resulting changes

- Existing SDK metadata: reciprocal canonical/hreflang (`en`, `zh-CN`, Chinese x-default) and indexable sitemap pair. Retained; title now names 100Hz raw PPG alongside SDK/cloud.
- Shared `GeoPageLayout`: BreadcrumbList and FAQPage; new FAQs use the same data for visible copy and JSON-LD, not a second schema block.
- Existing first/latest attribution capture runs in root layout and RFQ form. CTA adds only `keyword=100hz-raw-ppg`; it never fabricates or replaces UTM acquisition parameters. The existing keyword builder combines that interest with the detected AI suffix.
- Contextual links added only to Technology, Manufacturer, OEM/ODM, Healthcare, Sleep Monitoring and OSA Technology pages, in both languages. Existing links and unrelated copy retained. Global navigation is unchanged.
- No changes to OemRfqForm, attribution storage, lead contract, backend, schema, production workflow or runtime.

## Reproduction and verification

```sh
npm ci --ignore-scripts
node --test scripts/geo/raw-ppg.test.cjs scripts/rfq/client-contract.test.cjs scripts/rfq/attribution-contract.test.cjs
node --experimental-strip-types --test apps/web/lib/i18n-routes.spec.mjs
node scripts/geo/local-api-stub.cjs
# In a second shell, keep API calls local:
NEXT_PUBLIC_SITE_URL=https://www.longvon.com NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:34672 npm run build --workspace=apps/web
```

The dedicated `GEO Raw PPG regression` workflow starts the built standalone candidate locally and runs `raw-ppg-browser.cjs`. It validates SSR, language/canonical/hreflang, sitemap, visible FAQ/schema agreement, 12 contextual links, desktop/mobile overflow, and both localized CTA→RFQ payloads. Playwright fulfills synthetic submissions; no API/DB write occurs. It has no production environment, deployment step or secrets.

The optional local `GEO_CAPTURE_BASELINE=1` captures public production pages using GET-only, fresh unauthenticated browser contexts. It never posts to production. Evidence clearly distinguishes production-before from local-candidate-after. Public CI omits production capture.

## Independent self-review

- 100Hz is a conditional partner access discussion, not a guarantee for every SKU, continuous collection or real-time BLE streaming.
- Unsupported formats, rates beyond the stated PPG topic, durations, sensor/LED controls, API inventories, ring compatibility and commercial terms are withheld and explicitly scoped as questions.
- Customer App integration remains conditional; cloud algorithms are separated from SDK/data transport. No offline-all-algorithms or unrestricted protocol promise.
- Ring1C is not a medical device; no clinical or overseas clearance claim is introduced.
- The existing recovery workflow remains production-gated outside this issue. Do not merge this PR: successful main CI can automatically trigger the existing production pipeline. A later publication needs separate owner approval.

See COPY.md, CLAIM-SOURCES.md and evidence/verification.json for exact review material and actual validation results.
