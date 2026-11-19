CREATE TABLE IF NOT EXISTS "public"."article_distributions" (
  "id" UUID NOT NULL DEFAULT uuidv7(),
  "article_id" UUID NOT NULL,
  "platform" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "external_id" TEXT,
  "external_url" TEXT,
  "last_error" TEXT,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "synced_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "article_distributions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "article_distributions_article_id_fkey"
    FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "article_distributions_article_platform_key" UNIQUE ("article_id", "platform")
);

CREATE INDEX IF NOT EXISTS "article_distributions_status_updated_at_idx"
  ON "public"."article_distributions"("status", "updated_at");
