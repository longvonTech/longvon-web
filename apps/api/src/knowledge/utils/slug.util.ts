/**
 * Slug生成与基础校验工具。
 * 呼应seo-content-ux-v1.md与physical-database-freeze-v1.md对slug字段的唯一性要求，
 * 这里只负责"从标题派生一个候选slug"与"格式校验"，唯一性冲突检测放在各自Service里
 * （因为冲突检测需要查数据库，属于Service职责，不属于纯工具函数职责）。
 */

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      // 中文标题没有天然的拉丁字母分词依据，简单替换非字母数字字符为短横线；
      // 如果派生结果为空（纯中文标题且未提供英文slug候选），调用方需自行兜底
      // 用uuid片段等方式生成slug，本函数不做"中文转拼音"这类需要额外依赖的转换
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}

export function isValidSlugFormat(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}
