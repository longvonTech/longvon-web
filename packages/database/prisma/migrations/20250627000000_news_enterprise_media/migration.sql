-- 企业动态：支持视频与多媒体附件
ALTER TABLE "public"."news" ADD COLUMN IF NOT EXISTS "video_url" TEXT;
ALTER TABLE "public"."news" ADD COLUMN IF NOT EXISTS "media" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "public"."news" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE "public"."news" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS "news_status_published_at_idx" ON "public"."news"("status", "published_at");
