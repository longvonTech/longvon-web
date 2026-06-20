import type { Metadata } from 'next';
import { PartnerLandingLayout } from '../../../components/PartnerLandingLayout';
import { getSiteUrl } from '../../../lib/site';

export const metadata: Metadata = {
  title: '区域代理合作 | MATEYOU',
  description: 'MATEYOU面向区域代理商提供独家/非独家代理合作方案，涵盖区域保护政策与最小订货量说明。',
  alternates: { canonical: `${getSiteUrl()}/partner/distributor` },
};

export default function DistributorPartnerPage() {
  return (
    <PartnerLandingLayout
      cooperationType="distributor"
      title="区域代理合作"
      intro="面向有渠道资源的区域代理商，提供独家/非独家代理合作方案。"
      valueProps={[
        { title: '区域保护政策', description: '独家代理商可获得明确的区域保护政策说明' },
        { title: '最小订货量说明', description: '提供不同代理层级对应的最小订货量与价格梯度' },
        { title: '市场支持', description: '提供区域市场推广物料与上市支持' },
        { title: '渠道培训', description: '提供产品知识与销售培训，协助代理商团队快速上手' },
      ]}
    />
  );
}
