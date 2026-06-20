import { QualificationForm } from './QualificationForm';
import type { CooperationType } from '../lib/partner-api';

interface Props {
  cooperationType: CooperationType;
  title: string;
  intro: string;
  valueProps: { title: string; description: string }[];
}

/**
 * 共享布局——5个Partner Landing Page结构一致（标题/简介/价值点列表/表单），
 * 但每页传入的title/intro/valueProps内容完全独立，呼应TASK-104A
 * "每类合作对象独立内容"的要求：独立体现在传入的文案内容上，
 * 不是体现在"每页一套完全不同的组件实现"上，结构复用不等于内容复用。
 */
export function PartnerLandingLayout({ cooperationType, title, intro, valueProps }: Props) {
  return (
    <main style={{ maxWidth: 900, margin: '60px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>{title}</h1>
      <p style={{ color: '#666', marginTop: 8, maxWidth: 600 }}>{intro}</p>

      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {valueProps.map((vp) => (
          <div key={vp.title} style={{ padding: 18, background: '#fafafa', borderRadius: 8 }}>
            <div style={{ fontWeight: 600 }}>{vp.title}</div>
            <div style={{ color: '#666', fontSize: 14, marginTop: 6 }}>{vp.description}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #eee' }}>
        <QualificationForm cooperationType={cooperationType} />
      </div>
    </main>
  );
}
