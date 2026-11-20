# GEO-43-001 claim-to-source matrix

This matrix applies to the added bilingual section, four FAQs and contextual anchor labels. COPY.md is the exact copy draft. It does not reclassify historical REVIEW documents as APPROVED or substitute discussion-level evidence for a technical pack.

## Source register

- S1 — Published source baseline, main `01564a4a7dbcff6c15c00349e28ede5407fbeac5`, `apps/web/app/en/smart-ring-sdk-api/page.tsx` and its unprefixed ZH counterpart. Use the base revision, not a claim added by this PR, as corroboration. Actual public GET-before HTML/screenshots are in evidence/.
- S2 — `docs/geo/LONGVON_PRODUCT_TECHNICAL_EVIDENCE.md`: 100Hz access and SDK/cloud are PARTIAL; technical pack pending; Ring1C non-medical positioning VERIFIED. No SKU-wide streaming or compatibility evidence.
- S3 — `docs/geo/LONGVON_SDK_CLOUD_API_COMMERCIAL_SPEC.md`: REVIEW, qualified partner SDK/data route, customer App support, cloud dependence and discovery/NDA/scope process. Historical deployment-status lines are stale and not used as current-state evidence.
- S4 — `docs/geo/phase-4.2/wp07-osa/WP07-OWNER-DECISIONS-ACKNOWLEDGED.md`: D-04 permits cautious 100Hz wording rather than unsupported detail; D-03/05/06/07/08 constrain technical/regulatory claims.
- S5 — Issue #21: https://github.com/longvonTech/longvon-web/issues/21. Defines the current baseline/boundaries and the requested discovery questions; it is not a technical datasheet or new commercial-policy approval.
- S6 — `apps/web/lib/geo.ts`: LONGVON manufacturer/ODM entity; MATEYOU product brand. Retained by SDK lead; not reinterpreted as a customer or certification claim.
- U1 — Standard unit definition: hertz is inverse seconds (BIPM SI Brochure, https://www.bipm.org/en/publications/si-brochure). Applying it to a stated sampling frequency yields 100 sampling events/second. This is an explanatory unit conversion, not a device test or streaming guarantee.

## Technical statement rows

- C01 — Intro/title/anchor and original raw-access FAQ: qualified OEM/ODM partners **can discuss** a 100Hz raw PPG path through the agreed SDK/project. Sources S1, S2, S3, S4 D-04, S5. Evidence remains PARTIAL. No blanket model compatibility, continuous operation or automatic entitlement is claimed. The technical pack is still absent.
- C02 — Meaning paragraph and streaming FAQ: 100Hz as a sampling frequency means 100 samples/second. Source U1, interpreted only within C01's conditional topic. Timing/latency/buffering/cloud-update statements are explicit non-guarantees. Sources S1's SOW boundary and S5; no operational values are introduced.
- C03 — SDK/App responsibility: agreed device connectivity/data pathways; customer-owned App integration subject to evaluation. Sources S1 SDK/cloud section and customer-App section, S3, S5. Supported models/platforms/data must be confirmed; no OS list or BLE control surface is invented.
- C04 — Cloud responsibility and raw-vs-algorithm FAQ: many metrics use cloud services; raw access is not equivalent to offline algorithms, every-metric API availability or unrestricted BLE access. Sources S1 algorithm/boundary/FAQ sections, S2, S3, S5. The every-metric API sentence withholds a promise; it is not an API inventory.
- C05 — Scope list: model/hardware, signals/sampling, format/units/timing, transfer/buffering, platforms/SDK/docs, App ownership, permissions and cloud environment. Sources S1 SOW/process, S3, S5's explicitly requested scope checklist. These are unanswered discovery questions, not claims that a particular field, platform, retention/latency or permission implementation exists.
- C06 — Process and consultation FAQ/CTA: discovery/NDA → scoped hardware/SDK path → data permissions, device/App/cloud responsibilities and technical/commercial scope. Sources S1 process/licensing, S3, S5. No deadline, access guarantee, fee, refund, MOQ or licensing term is offered.
- C07 — Medical caution/FAQ: Ring1C is consumer health monitoring, not a medical device; raw access is not proof of clinical validation; Chinese progress does not establish overseas clearance. Sources S1 boundaries, S2, S4, S5. No Ring1 registration, clinical performance or diagnosis promise is introduced.
- C08 — Manufacturer/brand distinction: inherited LONGVON/MATEYOU statement. Sources S1 lead and S6. No changes to the entity definition.
- C09 — Contextual link text: invitation to evaluate the C01 topic via partner SDK. Same conditional target; sources C01/S5. It is not an additional capability claim on the entry pages.

## Explicitly withheld

No packet/bit layout, sensor gain/LED controls, buffer duration, continuous streaming, real-time latency, retention period, SKU compatibility, API endpoint availability, pricing, annual fees, refund condition, MOQ or new licensing entitlement is asserted. Research/algorithm evaluation is a buyer use case, not a medical or technical validation claim. Formal technical and commercial commitments require their own approved project documents.

## Attribution implementation evidence

The CTA URL contains only `keyword=100hz-raw-ppg`. Existing `LeadAttributionCapture`, `lead-attribution.ts`, `buildLeadKeyword` and `OemRfqForm` remain byte-identical to the base. The local browser captures prove first/latest UTM/content/term, AI suffix and original international phone survive the actual CTA→form path in EN/ZH. POST is intercepted; this is neither a production submission nor database acceptance.
