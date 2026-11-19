-- Lead first/latest attribution JSON + commercial pipeline (parallel to CRM status).
-- Rollback:
--   ALTER TABLE "leads" DROP COLUMN IF EXISTS "attribution";
--   ALTER TABLE "leads" DROP COLUMN IF EXISTS "commercial_stage";
--   ALTER TABLE "leads" DROP COLUMN IF EXISTS "commercial_grade";
--   ALTER TABLE "leads" DROP COLUMN IF EXISTS "commercial_meta";
--   DROP INDEX IF EXISTS "leads_commercial_stage_idx";

ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "attribution" JSONB;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "commercial_stage" TEXT NOT NULL DEFAULT 'NEW_INQUIRY';
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "commercial_grade" TEXT;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "commercial_meta" JSONB;

CREATE INDEX IF NOT EXISTS "leads_commercial_stage_idx" ON "leads" ("commercial_stage");
