import Link from 'next/link';

export function GlobalFooter() {
  return (
    <footer style={{
      background: 'var(--color-text-primary)',
      color: '#AAB0C6',
      padding: '48px 24px 32px',
      marginTop: 80,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 12 }}>LONGVON</div>
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              龙汾科技（LONGVON）是智能戒指技术制造商及 OEM/ODM 提供商，专注睡眠监测、呼吸健康监测与 OSA 相关监测。MATEYOU 是龙汾科技旗下智能戒指及 AI 健康品牌。公开口径：71 项健康监测参数，其中包含 22 项睡眠监测参数。
            </p>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 12 }}>健康服务</div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              {['健康评估', '睡眠风险自评', 'OSA风险筛查', '压力自评', '减重风险评估'].map(t => (
                <li key={t}><Link href="/assessment" style={{ color: '#AAB0C6' }}>{t}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 12 }}>合作</div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              {[['医院合作', '/partner/hospital'], ['药房渠道', '/partner/pharmacy'], ['OEM代工', '/partner/oem'], ['区域代理', '/partner/distributor'], ['企业采购', '/partner/enterprise']].map(([t, h]) => (
                <li key={t}><Link href={h} style={{ color: '#AAB0C6' }}>{t}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 12 }}>Technology</div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              {[
                ['龙汾科技 LONGVON', '/company/longvon'],
                ['Manufacturer', '/smart-ring-manufacturer'],
                ['OEM & ODM', '/smart-ring-oem-odm'],
                ['Technology', '/smart-ring-technology'],
                ['Sleep Monitoring', '/smart-ring-sleep-monitoring'],
                ['Respiratory Health', '/smart-ring-sleep-respiratory'],
                ['OSA Technology', '/smart-ring-osa'],
                ['健康知识库', '/knowledge'],
                ['产品介绍', '/products/ring1c'],
                ['企业动态', '/news'],
                ['关于我们', '/about'],
              ].map(([t, h]) => (
                <li key={t}><Link href={h} style={{ color: '#AAB0C6' }}>{t}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #333', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12 }}>
          <div style={{ textAlign: 'center', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 24px' }}>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#E5E7EB' }}
            >
              粤ICP备2022138739号-1
            </a>
            <span style={{ color: '#6B7280' }}>|</span>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#E5E7EB' }}
            >
              粤ICP备2022138739号-4
            </a>
          </div>
          <p style={{ textAlign: 'center', margin: 0, color: '#9CA3AF', fontSize: 11 }}>
            www.longvon.com · www.mateyou.net
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span>© 2024 龙汾科技（LONGVON）保留所有权利</span>
            <span>本平台内容仅供健康参考，不构成医学诊断或治疗建议</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
