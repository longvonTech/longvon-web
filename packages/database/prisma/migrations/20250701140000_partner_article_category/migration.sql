-- 商业合作文章分类 + 迁移已发布的 OEM 文章
INSERT INTO public.categories (id, name, slug, description, sort_order)
SELECT gen_random_uuid(), '商业合作', 'partner', 'OEM/ODM及商业合作相关资讯', 10
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'partner');

UPDATE public.articles
SET category_id = (SELECT id FROM public.categories WHERE slug = 'partner' LIMIT 1),
    seo_keywords = COALESCE(seo_keywords, '智能戒指OEM,智能戒指ODM,商业合作')
WHERE slug = 'smart-ring-solution-provider-ghxv'
  AND deleted_at IS NULL;
