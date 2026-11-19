-- Lead attribution for GEO / channel learning (referrer + first landing).
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "referrer" TEXT;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "landing_page" TEXT;
