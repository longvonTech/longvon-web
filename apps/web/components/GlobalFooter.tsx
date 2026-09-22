'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  getAlternateLocalePath,
  getLocaleFromPath,
} from '../lib/i18n-routes';

export function GlobalFooter() {
  const pathname = usePathname() || '/';
  const locale = getLocaleFromPath(pathname);
  const isEn = locale === 'en';
  const switchHref = getAlternateLocalePath(pathname, isEn ? 'zh' : 'en');

  const healthLinks = isEn
    ? [
        ['Company', '/en/company/longvon'],
        ['OEM / ODM', '/en/smart-ring-oem-odm'],
        ['Technology', '/en/smart-ring-technology'],
        ['Sleep Monitoring', '/en/smart-ring-sleep-monitoring'],
        ['Product', '/en/products/ring1c'],
      ]
    : [
        ['健康评估', '/assessment'],
        ['睡眠风险自评', '/assessment'],
        ['OSA风险筛查', '/assessment'],
        ['健康知识库', '/knowledge'],
        ['产品介绍', '/products/ring1c'],
      ];

  const partnerLinks = isEn
    ? [
        ['Partner Hub', '/en/partner'],
        ['OEM Inquiry', '/en/partner/oem'],
        ['Hospital (CN form)', '/partner/hospital'],
      ]
    : [
        ['医院合作', '/partner/hospital'],
        ['药房渠道', '/partner/pharmacy'],
        ['OEM代工', '/partner/oem'],
        ['区域代理', '/partner/distributor'],
        ['企业采购', '/partner/enterprise'],
      ];

  const techLinks = isEn
    ? [
        ['LONGVON Company', '/en/company/longvon'],
        ['Manufacturer', '/en/smart-ring-manufacturer'],
        ['OEM & ODM', '/en/smart-ring-oem-odm'],
        ['Technology', '/en/smart-ring-technology'],
        ['Respiratory Health', '/en/smart-ring-sleep-respiratory'],
        ['OSA Technology', '/en/smart-ring-osa'],
        ['About', '/en/about'],
        ['中文网站', '/'],
      ]
    : [
        ['龙汾科技 LONGVON', '/company/longvon'],
        ['智能戒指制造商', '/smart-ring-manufacturer'],
        ['智能戒指 OEM/ODM', '/smart-ring-oem-odm'],
        ['智能戒指技术', '/smart-ring-technology'],
        ['睡眠监测技术', '/smart-ring-sleep-monitoring'],
        ['睡眠呼吸健康监测', '/smart-ring-sleep-respiratory'],
        ['OSA 相关监测', '/smart-ring-osa'],
        ['英文官网', '/en'],
        ['健康知识库', '/knowledge'],
        ['产品介绍', '/products/ring1c'],
        ['企业动态', '/news'],
        ['关于我们', '/about'],
      ];

  return (
    <footer
      style={{
        background: 'var(--color-text-primary)',
        color: '#AAB0C6',
        padding: '48px 24px 32px',
        marginTop: 80,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 40,
            marginBottom: 40,
          }}
        >
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 12 }}>LONGVON</div>
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              {isEn
                ? 'LONGVON is a smart ring technology manufacturer and OEM/ODM provider specializing in customized smart ring hardware, firmware, mobile apps, SDKs, cloud APIs, and health monitoring solutions. MATEYOU is its smart ring product brand.'
                : 'LONGVON 是一家智能戒指技术制造商及 OEM/ODM 服务商，专注于智能戒指硬件、固件、移动 App、SDK、云端 API 及健康监测解决方案的定制开发与生产。MATEYOU 是其智能戒指产品品牌。公开口径：71 项健康监测参数，其中包含 22 项睡眠监测参数。'}
            </p>
            <p style={{ marginTop: 16 }}>
              <Link
                href={switchHref}
                style={{
                  display: 'inline-block',
                  padding: '8px 14px',
                  borderRadius: 980,
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {isEn ? '中文' : 'English'}
              </Link>
            </p>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 12 }}>
              {isEn ? 'Explore' : '健康服务'}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              {healthLinks.map(([t, h]) => (
                <li key={h + t}>
                  <Link href={h} style={{ color: '#AAB0C6' }}>
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 12 }}>
              {isEn ? 'Partners' : '合作'}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              {partnerLinks.map(([t, h]) => (
                <li key={h + t}>
                  <Link href={h} style={{ color: '#AAB0C6' }}>
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, marginBottom: 12 }}>
              {isEn ? 'Technology' : '技术与合作'}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              {techLinks.map(([t, h]) => (
                <li key={h + t}>
                  <Link href={h} style={{ color: '#AAB0C6' }}>
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #333', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12 }}>
          <div style={{ textAlign: 'center', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 24px' }}>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" style={{ color: '#E5E7EB' }}>
              粤ICP备2022138739号-1
            </a>
            <span style={{ color: '#6B7280' }}>|</span>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" style={{ color: '#E5E7EB' }}>
              粤ICP备2022138739号-4
            </a>
          </div>
          <p style={{ textAlign: 'center', margin: 0, color: '#9CA3AF', fontSize: 11 }}>
            www.longvon.com · www.mateyou.net
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span>© {new Date().getFullYear()} LONGVON Technology (Shenzhen) Co., Ltd.</span>
            <span>
              {isEn
                ? 'Content is for health reference only and does not constitute medical advice.'
                : '本平台内容仅供健康参考，不构成医学诊断或治疗建议'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
