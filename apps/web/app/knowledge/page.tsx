export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import { listArticles } from '../../lib/knowledge-api';
import { getSiteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: '健康知识库 | MATEYOU',
  description: '经医学审核的健康知识文章，覆盖睡眠、压力、体重管理等主题。',
  alternates: { canonical: `${getSiteUrl()}/knowledge` },
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-CN', { year:'numeric', month:'long', day:'numeric' });
}

function formatViews(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万次阅读`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k次阅读`;
  return `${count}次阅读`;
}

export default async function KnowledgeListPage() {
  const { items } = await listArticles();
  return (
    <main style={{ maxWidth:800, margin:'0 auto', padding:'60px 24px 80px' }}>
      {/* 标题区 */}
      <div style={{ marginBottom:48 }}>
        <h1 style={{ fontSize:'clamp(28px,4vw,40px)', fontWeight:700, letterSpacing:'-0.02em', color:'#1D1D1F', marginBottom:12 }}>
          健康知识库
        </h1>
        <p style={{ fontSize:17, color:'#6B7280', lineHeight:1.6 }}>
          全部内容经医学专家审核后发布，为你提供科学可信的健康参考。
        </p>
      </div>

      {items.length === 0 ? (
        <p style={{ color:'#9CA3AF', fontSize:16 }}>暂无已发布文章。</p>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {items.map((article, idx) => (
            <article key={article.id} style={{
              padding:'28px 0',
              borderBottom:'1px solid #F3F4F6',
              borderTop: idx === 0 ? '1px solid #F3F4F6' : 'none',
            }}>
              <Link href={`/knowledge/${article.slug}`} style={{ textDecoration:'none' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:20 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    {/* 分类标签 */}
                    {article.category?.name && (
                      <span style={{ fontSize:12, fontWeight:600, color:'#2563EB', letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:8, display:'block' }}>
                        {article.category.name}
                      </span>
                    )}
                    {/* 标题 */}
                    <h2 style={{ fontSize:'clamp(16px,2vw,19px)', fontWeight:600, color:'#1D1D1F', lineHeight:1.4, marginBottom:8 }}>
                      {article.title}
                    </h2>
                    {/* 摘要 */}
                    {article.summary && (
                      <p style={{ fontSize:15, color:'#6B7280', lineHeight:1.6, marginBottom:12,
                        overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' as any }}>
                        {article.summary}
                      </p>
                    )}
                    {/* 元信息：日期 + 阅读数 */}
                    <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                      {article.publishedAt && (
                        <span style={{ fontSize:13, color:'#9CA3AF', display:'flex', alignItems:'center', gap:4 }}>
                          📅 {formatDate(article.publishedAt)}
                        </span>
                      )}
                      <span style={{ fontSize:13, color:'#9CA3AF', display:'flex', alignItems:'center', gap:4 }}>
                        👁 {formatViews(article.viewCount || 0)}
                      </span>
                      {article.author?.name && (
                        <span style={{ fontSize:13, color:'#9CA3AF' }}>
                          ✍️ {article.author.name}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* 封面图（如有） */}
                  {article.coverImage && (
                    <div style={{ width:100, height:72, borderRadius:10, overflow:'hidden', flexShrink:0 }}>
                      <img src={article.coverImage} alt={article.title}
                        style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      {/* 免责声明 */}
      <div style={{ marginTop:48, padding:'16px 20px', background:'#F9FAFB', borderRadius:12, border:'1px solid #E5E7EB' }}>
        <p style={{ fontSize:13, color:'#9CA3AF', lineHeight:1.7 }}>
          <strong style={{ color:'#6B7280' }}>免责声明：</strong>
          本知识库内容仅供健康参考，不构成医学诊断或治疗建议。如有健康疑虑，请及时就医。
        </p>
      </div>
    </main>
  );
}
