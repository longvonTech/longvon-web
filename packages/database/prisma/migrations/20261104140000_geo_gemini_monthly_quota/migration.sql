-- Shared Gemini official-API monthly counter.
-- One row per UTC month. used_count increments only when a provider request
-- is reserved. Failed calls are not refunded. Web-manual captures do not write here.
-- Events store provider, model, month, count, grounding, and block reason. Never an API key.

CREATE TABLE IF NOT EXISTS "growth"."geo_gemini_quota_months" (
  "month_bucket" TEXT NOT NULL,
  "used_count" INTEGER NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "geo_gemini_quota_months_pkey" PRIMARY KEY ("month_bucket"),
  CONSTRAINT "geo_gemini_quota_months_bucket_check" CHECK ("month_bucket" ~ '^[0-9]{4}-[0-9]{2}$'),
  CONSTRAINT "geo_gemini_quota_months_used_check" CHECK ("used_count" >= 0)
);

CREATE TABLE IF NOT EXISTS "growth"."geo_gemini_quota_events" (
  "id" UUID NOT NULL DEFAULT uuidv7(),
  "provider" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "month_bucket" TEXT NOT NULL,
  "request_count" INTEGER NOT NULL,
  "grounding_enabled" BOOLEAN NOT NULL,
  "blocked" BOOLEAN NOT NULL,
  "block_reason" TEXT,
  "query_code" TEXT,
  "run_id" UUID,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "geo_gemini_quota_events_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "geo_gemini_quota_events_provider_check" CHECK ("provider" = 'gemini'),
  CONSTRAINT "geo_gemini_quota_events_grounding_check" CHECK ("grounding_enabled" = false),
  CONSTRAINT "geo_gemini_quota_events_count_check" CHECK ("request_count" >= 0)
);

CREATE INDEX IF NOT EXISTS "geo_gemini_quota_events_month_bucket_created_at_idx"
  ON "growth"."geo_gemini_quota_events"("month_bucket", "created_at");
