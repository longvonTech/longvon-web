export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { PartnerLandingLayout } from '../../../components/PartnerLandingLayout';
import { getSiteUrl } from '../../../lib/site';

export const metadata: Metadata = {
  title: { absolute: '医院合作咨询 | LONGVON' },
  description:
    '龙汾科技（LONGVON）接受医疗机构关于消费级可穿戴监测设备的合作咨询。MATEYOU 是产品品牌。Ring1C 具备 OSA 风险筛查，不是注册医疗器械。本页不列出医院名单、临床研究结果或注册证编号。',
  alternates: { canonical: `${getSiteUrl()}/partner/hospital` },
};

export default function HospitalPartnerPage() {
  return (
    <PartnerLandingLayout
      cooperationType="hospital"
      title="医院合作"
      intro="面向希望了解消费级智能戒指的医疗机构。合作范围是技术交流与设备介绍。Ring1C 具备 OSA 风险筛查，不是注册医疗器械，也不是临床诊断设备。"
      valueProps={[
        { title: '技术说明', description: '可提供传感器原理与数据采集方式的说明，包括 OSA 风险筛查的功能边界。本页不提供未经核验的临床案例、疗效或准确率。' },
        { title: '技术资料', description: '可按项目提供产品技术说明，说明传感器原理与数据采集方式。不把说明材料写成临床研究结论。' },
        { title: '产品定位', description: 'Ring1C 为消费级健康监测设备，具备 OSA 风险筛查，不是注册医疗器械。筛查结果不是临床诊断。未核验的注册证编号不在本页列出。' },
        { title: '专属对接', description: '指定业务负责人对接，根据科室实际需求定制合作方案' },
      ]}
    />
  );
}
