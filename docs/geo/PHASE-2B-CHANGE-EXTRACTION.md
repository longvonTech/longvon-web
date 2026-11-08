# Phase 2B — Change Extraction

Status: **implementation performed in isolated candidate; release blocked**.

## Source comparison
- Production snapshot base: `d5eb8c9b7e0c83638dadb7e4efb18baa37bfe1d` (limited web snapshot).
- FIX-01 baseline: `71b3e8893f56848732f49acb580ef461129dcc49` (`geo/fix-01-isolated`).
- Original dirty-worktree HEAD: `0b0d50d56952b2abe01264b70256a19fe7e641e0`.
- Candidate: `geo/fix-01-phase2-candidate`; two source edits only before documentation/package generation.

## FIX-01 five items
1. **SSR html lang** — baseline already contains `middleware.ts`, `HTML_LANG_HEADER`, `headers()` and `<html lang={lang}>`. Dirty-worktree root layout and i18n routes had no additional differences vs candidate base. Candidate build SSR confirmed `/` and `/partner/oem` as `zh-CN`, `/en` and English pages as `en`.
2. **RFQ hreflang / x-default** — baseline has `oemRfqAlternates`; emitted alternates for `/partner/oem` and `/en/partner/oem` are reciprocal, with x-default at English RFQ. No extra extraction.
3. **LONGVON / MATEYOU identity** — baseline root metadata identifies LONGVON as provider and MATEYOU as consumer brand. No additional extraction from broad dirty page edits.
4. **JSON-LD wording** — baseline `StructuredData.tsx` removes unsupported ISO 13485/NMPA knowledge claims and frames Ring1C as consumer product; source retained.
5. **EN OEM Organization + Service** — baseline provides `OrganizationSchema` plus locale-aware `OemServiceSchema locale="en"`; build output contains JSON-LD.

These five changes are present in the baseline commit; they were not reimplemented in Phase 2B. The baseline-to-snapshot diff does change root title/metadata and the OEM page metadata/schema/hreflang, and changes Chinese OEM alternates. No G5 capture component or form component is changed by that diff; root layout still renders `LeadAttributionCapture`.

## Metadata-only extraction from original worktree
- `apps/web/app/en/smart-ring-manufacturer/page.tsx`: replaced only `description` expression with the specified 145-character literal. No imports/body/CTA changed.
- `apps/web/app/en/partner/oem/page.tsx`: replaced only `description` expression with the specified 152-character literal. The dirty original version is a 318-line full-page rewrite; it imports/renders OemRfqForm and trust components. None of that rewrite was copied. The base already includes `OemRfqForm`; this is an inherited base behavior and must be evaluated as part of the production-target compatibility review.

Candidate delta is exactly two files, metadata only. See `PHASE-2B-FINAL-MANIFEST.md` for inventory hashes. No production deployment was performed.
