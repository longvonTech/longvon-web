-- Third-party syndication jobs (WeChat MP first)
CREATE SCHEMA IF NOT EXISTS "growth";

CREATE TABLE IF NOT EXISTS "growth"."syndication_jobs" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "platform" TEXT NOT NULL DEFAULT 'wechat_mp',
    "topic_key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "digest" TEXT,
    "content_markdown" TEXT NOT NULL,
    "content_html" TEXT NOT NULL,
    "source_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "article_id" UUID,
    "draft_media_id" TEXT,
    "publish_id" TEXT,
    "article_url" TEXT,
    "thumb_media_id" TEXT,
    "error_message" TEXT,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "syndication_jobs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "syndication_jobs_platform_status_idx"
  ON "growth"."syndication_jobs"("platform", "status");

CREATE INDEX IF NOT EXISTS "syndication_jobs_created_at_idx"
  ON "growth"."syndication_jobs"("created_at");
