import type { Metadata } from 'next';
import { PartnerLandingLayout } from '../../../components/PartnerLandingLayout';
import { getSiteUrl } from '../../../lib/site';

export const metadata: Metadata = {
  title: '企业批量采购 | MATEYOU',
  description: 'MATEYOU面向企业客户提供智能戒指批量采购方案，适用于员工健康福利、团建活动等场景。',
  alternates: { canonical: `${getSiteUrl()}/partner/enterprise` },
};

export default function EnterprisePartnerPage() {
  return (
    <PartnerLandingLayout
      cooperationType="enterprise"
      title="企业批量采购"
      intro="面向希望为员工提供健康福利的企业客户，提供智能戒指批量采购方案，可用于员工健康关怀、团建活动等场景。"
      valueProps={[
        { title: '批量采购价格', description: '根据采购数量提供阶梯价格方案' },
        { title: '统一开通与管理', description: '支持批量开通账号，便于企业统一管理与发放' },
        { title: '灵活的采购规模', description: '支持从几十台到上千台的不同采购规模，按需匹配服务方案' },
        { title: '专属客户经理', description: '指定客户经理负责采购全流程对接与售后支持' },
      ]}
    />
  );
}
