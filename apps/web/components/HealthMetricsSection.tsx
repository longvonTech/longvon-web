import Link from 'next/link';
import { HEALTH_METRIC_CATEGORIES, TOTAL_HEALTH_METRICS } from '../lib/health-metrics';

export function HealthMetricsSection() {
  return (
    <section style={{ background: '#0A0A0A', padding: '120px 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4B5563', marginBottom: 16 }}>
          Health Intelligence Platform
        </p>
        <p style={{ fontSize: 'clamp(100px,16vw,160px)', fontWeight: 800, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1, margin: '0 0 8px' }}>
          {TOTAL_HEALTH_METRICS}
          <span style={{ color: '#3B82F6' }}>+</span>
        </p>
        <p style={{ fontSize: 24, color: '#9CA3AF', marginBottom: 12 }}>健康监测指标，持续追踪</p>
        <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 48, lineHeight: 1.7 }}>
          参照 Ring1C 规格书 7 大功能模块，共 {TOTAL_HEALTH_METRICS} 项监测参数
        </p>

        <div className="health-metrics-grid">
          {HEALTH_METRIC_CATEGORIES.map(item => (
            <Link key={item.slug} href={`/metrics/${item.slug}`} className="health-metric-card">
              <div className="health-metric-card-top">
                <span className="health-metric-emoji">{item.emoji}</span>
                <span className="health-metric-count" style={{ color: item.color }}>
                  {item.count}
                  <small>项</small>
                </span>
              </div>
              <div className="health-metric-title">{item.title}</div>
              <div className="health-metric-sub">{item.titleEn}</div>
              <div className="health-metric-arrow">查看详情 →</div>
            </Link>
          ))}
        </div>

        <Link href="/metrics" style={{ display: 'inline-block', marginTop: 40, fontSize: 15, color: '#60A5FA', fontWeight: 600 }}>
          查看全部 7 大功能与参数清单 →
        </Link>
      </div>

      <style>{`
        .health-metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          text-align: left;
        }
        .health-metric-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          transition: transform 0.12s ease, background 0.12s ease, border-color 0.12s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .health-metric-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.16);
        }
        .health-metric-card:active {
          transform: scale(0.97);
          background: rgba(255,255,255,0.1);
        }
        .health-metric-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .health-metric-emoji {
          font-size: 28px;
        }
        .health-metric-count {
          font-size: 28px;
          font-weight: 800;
          line-height: 1;
        }
        .health-metric-count small {
          font-size: 14px;
          font-weight: 600;
          margin-left: 2px;
        }
        .health-metric-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
        }
        .health-metric-sub {
          font-size: 12px;
          color: #6B7280;
        }
        .health-metric-arrow {
          font-size: 13px;
          color: #9CA3AF;
          margin-top: 4px;
        }
        @media (min-width: 900px) {
          .health-metrics-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
