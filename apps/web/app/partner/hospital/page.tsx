export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { PartnerLandingLayout } from '../../../components/PartnerLandingLayout';
import { getSiteUrl } from '../../../lib/site';

export const metadata: Metadata = {
  title: '医院合作 | MATEYOU',
  description: 'MATEYOU面向医院的临床研究合作与睡眠/慢病管理科室设备引入方案。',
  alternates: { canonical: `${getSiteUrl()}/partner/hospital` },
};

export default function HospitalPartnerPage() {
  return (
    <PartnerLandingLayout
      cooperationType="hospital"
      title="医院合作"
      intro="面向睡眠医学中心、慢病管理科室等医疗机构，提供临床研究合作与可穿戴监测设备引入方案。"
      valueProps={[
        { title: '临床案例资料', description: '提供既往临床研究案例与数据支持，供贵院评估设备的实际应用效果' },
        { title: '研究合作白皮书', description: '可提供产品技术白皮书，说明传感器原理与数据采集方式' },
        { title: '合规资质', description: '提供产品合规资质文件，明确产品定位与适用范围（非医疗器械，消费级健康监测）' },
        { title: '专属对接', description: '指定业务负责人对接，根据科室实际需求定制合作方案' },
      ]}
    />
  );
}
