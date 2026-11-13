# Phase 2B — Protected Files Review

## Candidate delta against `71b3e88`
Only modified source files:
- `apps/web/app/en/partner/oem/page.tsx` — description string only.
- `apps/web/app/en/smart-ring-manufacturer/page.tsx` — description string only.

No changes to G5 capture (`LeadAttributionCapture`), attribution helper, Contact form, API, Prisma, database, nginx, `.env*`, PM2/deploy configuration. No protected paths are included in candidate COPY entries.

## Base-commit caveat
FIX-01 base commit vs production snapshot is not a two-file diff: it changes `apps/web/app/layout.tsx`, Chinese and English OEM pages, plus the SSR language/hreflang/schema files. Root layout retains G5 capture import/render, and G5 source modules are unchanged, but Chinese OEM page metadata is replaced. Production snapshot review explicitly records a `/contact → /partner/oem` production redirect that is absent in the Git baseline's `next.config.ts`; candidate HTTP check returned 404 for `/contact`.

Therefore no statement is made that the complete base candidate is behaviorally identical to the production deployment. Do not deploy until the authoritative production redirect/target state is reconciled and the Contact→OEM regression passes.

The dirty original worktree OEM page rewrite was not copied. Its use of RFQ form remains a source-level change relative to the original snapshot, and it is outside the two metadata-only candidate changes.
