import type { Metadata } from 'next';
import { PartnerLandingLayout } from '../../../components/PartnerLandingLayout';
import { getSiteUrl } from '../../../lib/site';

export const metadata: Metadata = {
  title: 'OEM代工合作 | MATEYOU',
  description: 'MATEYOU提供智能戒指/可穿戴设备的OEM代工生产合作，涵盖产能、质量体系与报价咨询。',
  alternates: { canonical: `${getSiteUrl()}/partner/oem` },
};

export default function OemPartnerPage() {
  return (
    <PartnerLandingLayout
      cooperationType="oem"
      title="OEM代工合作"
      intro="面向有代工生产需求的企业，提供智能戒指/可穿戴健康监测设备的OEM代工合作方案。"
      valueProps={[
        { title: '产能说明', description: '提供现有产线产能与交付周期说明，可根据订单量评估排期' },
        { title: '质量体系', description: '提供质量管理体系认证情况，供贵司供应链评估流程参考' },
        { title: '报价咨询', description: '根据贵司的订单规模与定制化需求提供报价方案' },
        { title: '定制化能力', description: '支持外观/包装/部分功能模块的定制化调整' },
      ]}
    />
  );
}
