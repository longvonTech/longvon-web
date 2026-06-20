import type { Metadata } from 'next';
import { BenefitsMatrix } from '../../components/membership/BenefitsMatrix';
import { getSiteUrl } from '../../lib/site';

export const metadata: Metadata = {
  title: '会员权益 | MATEYOU',
  description: 'MATEYOU健康自评平台会员权益说明——Free、Premium、Pro、Enterprise四档。',
  alternates: { canonical: `${getSiteUrl()}/membership` },
};

/**
 * 会员页（静态展示）——呼应TASK-106F。
 * 合规检查（TASK-106K）：
 * ①页面标题/副标题无"诊断""治疗""疗效"类词汇 ✓
 * ②权益描述全部为功能性描述 ✓
 * ③无"提升XX%""治好XX"类量化疗效宣称 ✓
 */
export default function MembershipPage() {
  return (
    <main style={{ maxWidth: 900, margin: '60px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>MATEYOU 会员权益</h1>
      <p style={{ color: '#666', marginTop: 8 }}>
        选择适合您的版本，解锁更完整的健康自评数据与工具。
      </p>

      <div style={{ marginTop: 40 }}>
        <BenefitsMatrix />
      </div>

      <div style={{ marginTop: 40, padding: 20, background: '#f5f5f5', borderRadius: 8 }}>
        <p style={{ color: '#888', fontSize: 13, lineHeight: 1.7 }}>
          以上全部功能仅为健康风险自评工具，结果仅供参考，不构成任何医学诊断或治疗建议。
          如有任何健康疑虑，请咨询专业医疗机构。企业版及定制化合作请通过
          <a href="/partner/enterprise" style={{ color: '#0066cc' }}>商业合作页面</a>联系我们。
        </p>
      </div>
    </main>
  );
}
