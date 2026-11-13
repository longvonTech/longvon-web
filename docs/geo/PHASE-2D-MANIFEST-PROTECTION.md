# Phase 2D — Manifest Protection

## Change
Whole-file `must_not_change` on `apps/web/app/en/smart-ring-manufacturer/page.tsx` was replaced with field-level protection:

- protect mode: `allow_metadata_description_only`
- allowed field: top-level `metadata.description` only
- forbidden: title, alternates, openGraph, robots, page body, imports, component behavior
- EN OEM page has the same field-level rule
- Deploy COPY blocking ignores `allow_metadata_description_only` entries
- Hard blocks remain for `must_not_change` / `must_not_touch` / etc.

## Automation
- `docs/geo/packages/geo-fix-01/FIELD-ALLOWLIST.json`
- `scripts/geo/assert-meta-description-only.mjs`
- Tests in `scripts/geo/assert-meta-description-only.spec.mjs`
- `scripts/geo/lib/fix-01-deploy.mjs` `denylistBlocksCopy()`

## Verified candidate diffs vs `71b3e88`
Both manufacturer and OEM normalize to identical files after replacing only `metadata.description`. Approved texts:
- Manufacturer 145 chars
- OEM 152 chars

## Contact / next.config
`apps/web/next.config.ts` Contact redirects remain candidate-local (`never_copy`). Not in Option B COPY.
