import type { ReactNode } from 'react';
import { sanitizeArticleContent } from '../lib/sanitize-article-content';

const HEADING_BOLD = { color: '#1D1D1F', fontWeight: 700 as const };
const INLINE_BOLD = { color: '#1D1D1F', fontWeight: 700 as const };
const BODY_COLOR = '#374151';

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) {
      return (
        <strong key={`${keyPrefix}-b-${i}`} style={INLINE_BOLD}>
          {bold[1]}
        </strong>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={`${keyPrefix}-l-${i}`} href={link[2]} style={{ color: '#0066CC' }}>
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

/** 知识库正文：去掉 #，**标题** 渲染为黑色加粗 */
export function ArticleContent({ content }: { content: string }) {
  const clean = sanitizeArticleContent(content);

  return (
    <div style={{ fontSize: 16, lineHeight: 1.8 }}>
      {clean.split('\n').map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={i} style={{ height: 12 }} aria-hidden />;
        }

        const wholeBold = trimmed.match(/^\*\*([^*]+)\*\*$/);
        if (wholeBold) {
          return (
            <p
              key={i}
              style={{
                margin: '1.35em 0 0.6em',
                fontSize: 17,
                lineHeight: 1.5,
                ...HEADING_BOLD,
              }}
            >
              {wholeBold[1]}
            </p>
          );
        }

        return (
          <p key={i} style={{ margin: '0 0 1em', color: BODY_COLOR }}>
            {renderInline(line, `ln-${i}`)}
          </p>
        );
      })}
    </div>
  );
}
