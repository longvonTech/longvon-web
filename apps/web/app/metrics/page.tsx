import type { Metadata } from 'next';
import Link from 'next/link';
import { HEALTH_METRIC_CATEGORIES, TOTAL_HEALTH_METRICS } from '../../lib/health-metrics';
import { getSiteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: '71+ 健康监测指标 · 7大功能参数清单',
  description: `MATEYOU Ring1C 覆盖 ${TOTAL_HEALTH_METRICS} 项健康监测参数，涵盖快速检测、运动、心率、血氧、压力、睡眠与 OSA 筛查七大功能模块。`,
  alternates: { canonical: `${getSiteUrl()}/metrics` },
};

export default function MetricsIndexPage() {
  return (
    <div style={{ background: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <section style={{ padding: '80px 24px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4B5563', marginBottom: 16 }}>
            Health Metrics
          </p>
          <h1 style={{ fontSize: 'clamp(48px,8vw,80px)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 12px' }}>
            {TOTAL_HEALTH_METRICS}
            <span style={{ color: '#3B82F6' }}>+</span>
          </h1>
          <p style={{ fontSize: 20, color: '#9CA3AF', marginBottom: 16 }}>健康监测指标</p>
          <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.7 }}>
            7 大功能模块 · 规格书完整参数对照
          </p>
        </div>
      </section>

      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {HEALTH_METRIC_CATEGORIES.map((item, i) => (
            <Link
              key={item.slug}
              href={`/metrics/${item.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: '24px 28px',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: '#4B5563', width: 24 }}>{i + 1}</span>
              <span style={{ fontSize: 32 }}>{item.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.5 }}>{item.summary}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.count}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>项参数</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
