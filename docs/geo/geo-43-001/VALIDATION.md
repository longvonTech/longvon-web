# GEO-43-001 validation

Local result: PASS. Base main01564a4a7dbcff6c15c00349e28ede5407fbeac5. Feature only; no production deployment or DB write.

- Content/routing/RFQ unit contracts: 14/14.
- Existing i18n route tests: 5/5.
- Web lint: exit0; existing unrelated admin React-hook warnings retained.
- Full Next.js Web build: exit0; final standalone starts successfully.
- Actual built EN/ZH pages: HTTP200, one H1 and one raw-data section each.
- Canonical/hreflang: reciprocal EN/ZH/x-default, no fragment canonical.
- FAQ: one FAQPage with ten questions matching visible question/answer text in each language; BreadcrumbList retained.
- Sitemap: each SDK canonical appears once; no fragment or duplicate new route.
- Contextual links: all twelve source pages render correct locale target; actual Technology→section click and anchor scroll passed in both locales.
- Desktop1440px/mobile390px: rendered screenshots, no horizontal overflow, no page errors.
- CTA→real form handler→intercepted transport: two synthetic localized payloads with original international phone, first/latest UTM content+term, AI suffix and interest keyword intact. No backend/SQL write; productionPOSTs0.
- Existing RFQ form, attribution capture/storage, lead contract, backend/database model and production workflow unchanged by hash comparison (integrity.json).

Evidence environments: *-before-production.* are fresh unauthenticated production GET-only snapshots, taken while the feature remained undeployed. *-after.* are the isolated built candidate using a local synthetic API. initial-verification.json records the earlier production-baseline capture; verification.json is the final standalone validation. These results are not a claim that new copy has shipped or that a real customer lead was submitted.

The first browser harness attempt used an unescaped CSS # selector for a numeric-leading HTML id. The test selector was corrected to an attribute selector; native HTML hash navigation works and is explicitly tested. No application issue was hidden by dropping an assertion.

Independent CI is defined in .github/workflows/geo-raw-ppg.yml; PR check links will be recorded in the PR. No merge or publication is authorized here.
