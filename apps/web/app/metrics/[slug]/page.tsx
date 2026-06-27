import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  HEALTH_METRIC_CATEGORIES,
  TOTAL_HEALTH_METRICS,
  getAllHealthMetricSlugs,
  getHealthMetricBySlug,
} from '../../../lib/health-metrics';
import { getSiteUrl } from '../../../lib/site';

export function generateStaticParams() {
  return getAllHealthMetricSlugs().map(slug => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getHealthMetricBySlug(slug);
  if (!category) return { title: '监测参数' };
  return {
    title: `${category.title} · ${category.count}项监测参数`,
    description: category.summary,
    alternates: { canonical: `${getSiteUrl()}/metrics/${slug}` },
  };
}

export default async function MetricDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = getHealthMetricBySlug(slug);
  if (!category) notFound();

  const index = HEALTH_METRIC_CATEGORIES.findIndex(c => c.slug === slug);
  const prev = index > 0 ? HEALTH_METRIC_CATEGORIES[index - 1] : null;
  const next = index < HEALTH_METRIC_CATEGORIES.length - 1 ? HEALTH_METRIC_CATEGORIES[index + 1] : null;

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ padding: '48px 24px 64px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32, fontSize: 14 }}>
            <Link href="/" style={{ color: '#6B7280' }}>首页</Link>
            <span style={{ color: '#374151' }}>/</span>
            <Link href="/metrics" style={{ color: '#6B7280' }}>71+ 监测指标</Link>
            <span style={{ color: '#374151' }}>/</span>
            <span style={{ color: '#9CA3AF' }}>{category.title}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 28 }}>
            <span style={{ fontSize: 56 }}>{category.emoji}</span>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: category.color, marginBottom: 8 }}>
                {category.titleEn}
              </p>
              <h1 style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 12px' }}>
                {category.title}
              </h1>
              <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, padding: '8px 16px', borderRadius: 980, background: 'rgba(255,255,255,0.06)', border: `1px solid ${category.color}33` }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: category.color }}>{category.count}</span>
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>项监测参数</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 17, color: '#9CA3AF', lineHeight: 1.8, maxWidth: 720, margin: 0 }}>
            {category.summary}
          </p>
        </div>
      </section>

      {/* Parameters */}
      <section style={{ padding: '64px 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>参数清单</h2>
            <span style={{ fontSize: 13, color: '#6B7280' }}>
              全平台共 {TOTAL_HEALTH_METRICS} 项 · 本模块 {category.count} 项
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {category.parameters.map((param, i) => (
              <div
                key={param}
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  padding: '16px 18px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span style={{
                  flexShrink: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: `${category.color}22`,
                  color: category.color,
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 15, color: '#E5E7EB', lineHeight: 1.55 }}>{param}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ padding: '0 24px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>
            以上参数为 Ring1C 及 MATEYOU App 健康监测功能规格说明，监测数据仅供健康参考，不构成医学诊断或治疗依据。
          </p>
        </div>
      </section>

      {/* Prev / Next */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {prev ? (
            <Link href={`/metrics/${prev.slug}`} style={{ padding: '20px 24px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>← 上一功能</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{prev.title}</div>
              <div style={{ fontSize: 13, color: prev.color, marginTop: 4 }}>{prev.count} 项参数</div>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/metrics/${next.slug}`} style={{ padding: '20px 24px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>下一功能 →</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{next.title}</div>
              <div style={{ fontSize: 13, color: next.color, marginTop: 4 }}>{next.count} 项参数</div>
            </Link>
          ) : <div />}
        </div>

        <div style={{ maxWidth: 900, margin: '32px auto 0', display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/metrics" style={{ padding: '12px 28px', borderRadius: 980, border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 15, fontWeight: 600 }}>
            全部 7 大功能
          </Link>
          <Link href="/products/ring1c" style={{ padding: '12px 28px', borderRadius: 980, background: '#2563EB', color: '#fff', fontSize: 15, fontWeight: 600 }}>
            了解 Ring1C
          </Link>
        </div>
      </section>
    </div>
  );
}
