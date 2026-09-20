/** 与 API 端一致：知识库正文纯文本展示，去掉 Markdown # */
export function sanitizeArticleContent(content: string): string {
  if (!content) return content;
  return content
    .split('\n')
    .map((line) => line.replace(/^\s*#+\s*/, ''))
    .join('\n')
    .replace(/#/g, '');
}
