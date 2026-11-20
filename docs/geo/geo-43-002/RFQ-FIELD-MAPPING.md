# RFQ field mapping and attribution

## Retained fields

- Contact name/company/business email/international phone → existing DTO fields.
- Project type → existing cooperationType; project/function/stage/initial estimate/capabilities/market/timeline/message → existing remark format.
- First/latest landing/referrer/UTM source/medium/campaign/content/term, AI label/confidence → existing unchanged attribution/DTO path.
- Existing hidden website field, validators, API endpoint, error mapping and general@longvon.com fallback retained.

## Two optional additions

- `modelUseCase` (max300): intended product/model/use case → remark line `Intended Product / Model / Use Case`.
- `quantityPlan` (max200): buyer's sample/pilot/annual forecast → remark line `Sample / Pilot / Annual Forecast`.

No new top-level request property is sent. These are not company MOQ values and do not advance a commercial/order stage. Unknowns may be blank. Existing required fields and selectors remain; the new fields are not required. Combined project notes must fit the existing 2000-character DTO limit; excess notes now generate a clear client error before POST instead of silent clipping. No submitted text is silently truncated to accommodate the new fields.

## Interest and acquisition separation

The stage CTA sets only the existing `keyword` parameter. It does not set or replace an acquisition UTM source/medium/campaign. The existing keyword helper appends AI provenance without losing the intent; first/latest capture is unchanged. Reports must distinguish a supplied AI/UTM label from a verified recommendation or qualified customer.

## Regression evidence scope

Six local built EN/ZH stage paths verify first/latest content+term and AI/interest, original international phone, market/timing and new remark lines. Oversized inputs make zero POSTs; API errors do not emit a success event and retain email fallback. All synthetic requests are intercepted and test signals excluded from the commercial queue. The existing two-locale PPG CTA test also passes with new optional fields blank.

The server service/repository/notification logic, endpoint and database/Prisma model are unchanged. No production WeCom test or SQL write is performed here; these checks do not replace prior production RFQ/notification acceptance or claim a new live receipt.
