-- 企业动态列表排序（数值越小越靠前）
ALTER TABLE "public"."news" ADD COLUMN IF NOT EXISTS "sort_order" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "news_status_sort_order_idx" ON "public"."news"("status", "sort_order", "published_at");
