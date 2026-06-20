import type { Metadata } from 'next';
import { PartnerLandingLayout } from '../../../components/PartnerLandingLayout';
import { getSiteUrl } from '../../../lib/site';

export const metadata: Metadata = {
  title: '药房渠道合作 | MATEYOU',
  description: 'MATEYOU面向连锁药房与零售药店的渠道铺货与销售支持合作方案。',
  alternates: { canonical: `${getSiteUrl()}/partner/pharmacy` },
};

export default function PharmacyPartnerPage() {
  return (
    <PartnerLandingLayout
      cooperationType="pharmacy"
      title="药房渠道合作"
      intro="面向连锁药房与零售药店，提供渠道铺货政策、陈列支持与导购培训。"
      valueProps={[
        { title: '渠道政策', description: '提供阶梯进货价与区域渠道保护政策说明' },
        { title: '陈列与物料支持', description: '提供货架陈列方案与导购宣传物料' },
        { title: '导购培训', description: '提供产品知识与销售话术培训，帮助门店人员准确介绍产品定位' },
        { title: '销售数据回顾', description: '定期提供销售数据回顾，协助门店优化备货节奏' },
      ]}
    />
  );
}
