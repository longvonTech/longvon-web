# GEO-FIX-01 production protection list

Do **not** overwrite or delete these paths during FIX-01 deploy. Do **not** rsync the isolated `apps/web` tree as a unit.

Machine-readable copy: `docs/geo/packages/geo-fix-01/DENYLIST.json`  
SHA256 values are ECS read-only hashes from 2026-11-02 (`GEO-FIX-01-DEPLOYMENT-REVIEW.md`).

## Config and sitemaps

- `apps/web/next.config.ts`
- `apps/web/app/sitemap.ts`

## Homepages

- `apps/web/app/page.tsx`
- `apps/web/app/en/page.tsx`

## Company evidence pages and images

- `apps/web/app/company/longvon/page.tsx`
- `apps/web/app/en/company/longvon/page.tsx`
- `apps/web/components/CompanyTrustEvidence.tsx`
- `apps/web/components/LeadershipTrust.tsx`
- `apps/web/public/images/company/`
- `apps/web/public/images/company/founder-credentials.jpg`
- `apps/web/public/images/company/manufacturing-capability.jpg`
- `apps/web/public/images/company/rd-ai-algorithms.jpg`
- `apps/web/public/images/company/rd-hardware-team.jpg`
- `apps/web/public/images/shi-libing.jpg`

## Production GEO cluster (ZH)

- `apps/web/app/smart-ring-healthcare-solutions/page.tsx`
- `apps/web/app/smart-ring-manufacturer/page.tsx`
- `apps/web/app/smart-ring-oem-odm/page.tsx`
- `apps/web/app/smart-ring-osa/page.tsx`
- `apps/web/app/smart-ring-sleep-monitoring/page.tsx`
- `apps/web/app/smart-ring-sleep-respiratory/page.tsx`
- `apps/web/app/smart-ring-solution-provider/page.tsx`
- `apps/web/app/smart-ring-technology/page.tsx`

## Production GEO cluster (EN, except the FIX-01 EN OEM/ODM page)

- `apps/web/app/en/smart-ring-healthcare-solutions/page.tsx`
- `apps/web/app/en/smart-ring-manufacturer/page.tsx`
- `apps/web/app/en/smart-ring-osa/page.tsx`
- `apps/web/app/en/smart-ring-sleep-monitoring/page.tsx`
- `apps/web/app/en/smart-ring-sleep-respiratory/page.tsx`
- `apps/web/app/en/smart-ring-solution-provider/page.tsx`
- `apps/web/app/en/smart-ring-technology/page.tsx`
- `apps/web/app/en/products/ring1c/page.tsx`

FIX-01 **does** replace `apps/web/app/en/smart-ring-oem-odm/page.tsx`. That path is on the allow-list, not this denylist.

## Production UI that differs from git HEAD

- `apps/web/components/HeroSection.tsx`
- `apps/web/components/QualificationForm.tsx`
- `apps/web/components/PartnerRelatedArticles.tsx`
- `apps/web/app/products/ring1c/AppScreensGallery.tsx`
- `apps/web/app/products/ring1c/SizeGuide.tsx`

## G5 attribution (keep byte-identical)

- `apps/web/components/LeadAttributionCapture.tsx`
- `apps/web/lib/lead-attribution.ts`
- `apps/web/lib/partner-api.ts`
- `apps/web/components/OemRfqForm.tsx`

Root `apps/web/app/layout.tsx` **is** a FIX-01 REPLACE, but the replacement must still import and render `LeadAttributionCapture`.

## Production OEM helpers already on ECS (do not replace from git HEAD)

- `apps/web/components/EnTrustStrip.tsx`
- `apps/web/lib/geo-trust-en.ts`
- `apps/web/components/GeoPageLayout.tsx`
- `apps/web/lib/geo.ts`
- `apps/web/lib/geo-commercial.ts`

## Production-only admin / media helpers

- `apps/web/app/admin/growth/layout.tsx`
- `apps/web/lib/admin-auth.ts`
- `apps/web/lib/image-slots.ts`

## API, database, nginx, env, PM2

- `apps/api/`
- `packages/database/`
- `infra/`
- `.env.production`
- `ecosystem.config.js`
- `.github/workflows/deploy.yml` (do not run)
- `scripts/deploy.sh` (do not run; it calls `prisma migrate deploy`)
