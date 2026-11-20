# GEO-43-002 — qualified ODM sample-to-production funnel

Issue: https://github.com/longvonTech/longvon-web/issues/23.
Base main: `62ae62ef31e7a3cd239302c53c11c359304d0ca7` (includes the accepted GEO-43-001 work). Feature only; no merge, production deploy, database change or real customer action is authorized here.

## Commercial review status

The owner indicated that numeric publication approval exists, but has not yet supplied the source/version or model/project applicability. The current procurement source still says not to publish a fixed MOQ. This review candidate therefore uses model/configuration/project-qualified language, withholds the numeric pilot/MOQ values and flags the applicability gap in CLAIM-SOURCES.md. Do not infer that a pilot option is a universal ODM minimum. Numeric copy may be added only after the missing source/scope is confirmed.

## Architecture and exact candidate URLs

- EN primary: https://www.longvon.com/en/smart-ring-oem-odm#sample-to-production
- ZH primary: https://www.longvon.com/smart-ring-oem-odm#sample-to-production
- Manufacturer pages add a compact route into this journey, not a duplicate indexed landing page.
- Contextual entries: manufacturer, SDK/API, healthcare and Ring1C reference-product pages in both locales.
- Stage CTA destinations: `/en/partner/oem?keyword=odm-sample-evaluation`, `odm-pilot-evaluation`, `odm-production-feasibility`; ZH uses unprefixed `/partner/oem`.

Canonical, reciprocal hreflang, x-default and sitemap stay on the existing fragment-free page pairs. No new route or public query-indexing scheme is added. Product/manufacturer identity remains LONGVON; MATEYOU is the product brand. No medical or new performance claims are introduced.

## Buyer value

The three stages each state buyer inputs, the purpose of the review and a qualification/acceptance gate. Requests and forecasts are distinguished from accepted orders and payment. Model-specific customization covers existing-platform branding/packaging, project-scoped design/hardware/firmware, customer App/SDK/API and cloud responsibilities.

Two optional RFQ fields help the sales team: intended model/product/use case and sample/pilot/annual quantity plan. No additional required field, top-level DTO key, backend column or migration. Existing market/timing/contact/functions remain. Oversized combined notes produce an explicit client error instead of silently truncating information.

## Conversion scope

New CTA click, form start and acknowledged submission signals use the optional existing Baidu queue, with no personal data or new external service. TEST/local signals remain in a flagged QA DOM stream, excluded from the commercial queue. A boolean session flag keeps a QA classification across navigation. Analytics failure cannot affect the form. Human-verified qualified lead and accepted order definitions remain separate, as detailed in CONVERSION-EVENTS.md.

This work does not implement a CRM dashboard, new sales states, paid-order detection or automatic qualification. It does not claim any measured uplift. No real production TEST or WeCom notification is sent. Backend, attribution storage, phone/keyword contract and notification code remain unchanged.

## Local and CI verification

- `node --test scripts/geo/oem-journey.test.cjs scripts/geo/raw-ppg.test.cjs scripts/rfq/client-contract.test.cjs scripts/rfq/attribution-contract.test.cjs`
- `node --experimental-strip-types --test apps/web/lib/i18n-routes.spec.mjs`
- Web lint/build; standalone run with local read-only API stub.
- `oem-journey-browser.cjs`: six EN/ZH stage paths, SSR/FAQ/canonical/sitemap/entry links, mobile rendering, optional brief mapping, international phone, first/latest UTM/AI, oversized-note rejection, API-failure email fallback and no false success events.
- Existing `raw-ppg-browser.cjs` retained to cover the accepted SDK funnel with optional new fields left blank.

The existing GEO CI retains every PPG check and adds the OEM suite. It has no production secrets, database operation or deploy step. All form POSTs are fulfilled by Playwright, not sent to an API/DB. Optional production-before snapshots are public GET-only and clearly labeled; after screenshots are the local candidate.

## Self-review boundary

No numeric terms, sample prices, lead times, capacity, warranties, certifications, medical claims or unrestricted SDK/BLE/offline capabilities are invented. Source uncertainty is not hidden. The scope is qualified commercial inquiry generation, not traffic claims. Do not merge or publish: main CI can trigger the existing production deployment pipeline after a merge, so independent review and separate owner publication approval remain mandatory.
