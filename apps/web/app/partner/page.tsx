export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: '商业合作 | MATEYOU',
  description: 'MATEYOU面向医院、药房、OEM代工、区域代理、企业批量采购的商业合作入口。',
  alternates: { canonical: `${getSiteUrl()}/partner` },
};

const PARTNER_TYPES = [
  { slug: 'hospital', name: '医院合作', desc: '临床研究合作、科室设备引入' },
  { slug: 'pharmacy', name: '药房渠道合作', desc: '零售渠道铺货与销售支持' },
  { slug: 'oem', name: 'OEM代工合作', desc: '代工生产与产能合作' },
  { slug: 'distributor', name: '区域代理合作', desc: '区域独家/非独家代理' },
  { slug: 'enterprise', name: '企业批量采购', desc: '员工健康福利批量采购' },
];

// 呼应TASK-104A要求："不得使用倒计时/虚假紧迫感/诱导性营销"——
// 本页面及全部5个子页面均不包含任何倒计时组件、库存告急提示、
// "仅限前N名"等话术，CTA文案统一使用平实的行动号召，不制造紧迫感。
export default function PartnerOverviewPage() {
  return (
    <main style={{ maxWidth: 760, margin: '60px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>商业合作</h1>
      <p style={{ color: '#666', marginTop: 8 }}>
        请选择与您需求最匹配的合作类型，了解具体合作方式并登记意向。
      </p>

      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {PARTNER_TYPES.map((type) => (
          <Link
            key={type.slug}
            href={`/partner/${type.slug}`}
            style={{
              display: 'block',
              padding: 20,
              border: '1px solid #eee',
              borderRadius: 8,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 600 }}>{type.name}</div>
            <div style={{ color: '#888', fontSize: 14, marginTop: 4 }}>{type.desc}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
