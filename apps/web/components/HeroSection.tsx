'use client';
import { useState } from 'react';
import Link from 'next/link';
import { RingColorSwitcher } from './RingColorSwitcher';

const COLORS = [
  { id: 'white', label: '白色', hex: '#F0F0F0', img: '/images/ring1c/White-45-Left.jpg' },
  { id: 'pink',  label: '粉色', hex: '#E8A0A8', img: '/images/ring1c/Pink-45-Left.jpg' },
  { id: 'blue',  label: '蓝色', hex: '#6B9ED2', img: '/images/ring1c/Blue-45-Left.jpg' },
  { id: 'black', label: '黑色', hex: '#2C2C2E', img: '/images/ring1c/Black-45-Left.jpg' },
];

export function HeroSection() {
  const [active, setActive] = useState(0);
  return (
    <section style={{ position:'relative', minHeight:'100vh', background:'#000', overflow:'hidden', display:'flex', alignItems:'center' }}>
      {/* 背景图：4张叠加，透明度切换 */}
      {COLORS.map((c, i) => (
        <img key={c.id} src={c.img} alt={'Ring1C '+c.label} style={{
          position:'absolute', inset:0, width:'100%', height:'100%',
          objectFit:'cover', objectPosition:'center 30%',
          opacity: i===active ? 0.85 : 0,
          transition:'opacity 0.6s ease',
        }} />
      ))}
      {/* 渐变遮罩 */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(105deg,rgba(0,0,0,0.78) 0%,rgba(0,0,0,0.45) 45%,rgba(0,0,0,0.1) 70%,transparent 100%)' }} />
      {/* 内容 */}
      <div style={{ position:'relative', zIndex:2, maxWidth:1100, margin:'0 auto', padding:'120px 48px 100px', width:'100%' }}>
        <p style={{ fontSize:13, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', marginBottom:24 }}>
          Ring1C · Personal Health Intelligence System
        </p>
        <h1 style={{ fontSize:'clamp(52px,7vw,88px)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.02, color:'#fff', marginBottom:28, maxWidth:640 }}>
          健康智能，<br /><span style={{ color:'#60A5FA' }}>静默守护</span>
        </h1>
        <p style={{ fontSize:20, color:'rgba(255,255,255,0.72)', lineHeight:1.7, maxWidth:480, marginBottom:48 }}>
          不只是智能戒指。MATEYOU Ring1C 是你的个人健康智能系统——为睡眠而生，为恢复而建，由人工智能驱动。
        </p>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
          <Link href="/partner" style={{ padding:'15px 36px', background:'#fff', color:'#1D1D1F', borderRadius:980, fontSize:16, fontWeight:700 }}>了解合作方案</Link>
          <Link href="/products/ring1c" style={{ padding:'15px 36px', background:'rgba(255,255,255,0.12)', color:'#fff', borderRadius:980, fontSize:16, fontWeight:600, border:'1px solid rgba(255,255,255,0.3)' }}>产品详情</Link>
        </div>
        <p style={{ marginTop:24, fontSize:12, color:'rgba(255,255,255,0.35)' }}>消费级健康监测设备 · 结果仅供参考 · 非医疗诊断</p>
      </div>
      {/* 颜色切换器（右下角） */}
      <div style={{ position:'absolute', bottom:60, right:60, zIndex:3, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(12px)', borderRadius:20, padding:'20px 28px', border:'1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginBottom:10, letterSpacing:'0.05em', textAlign:'center' }}>配色</p>
        <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
          {COLORS.map((c, i) => (
            <button key={c.id} onClick={() => setActive(i)} aria-label={c.label}
              style={{ width:20, height:20, borderRadius:'50%', background:c.hex,
                border: i===active ? '2px solid #fff' : '2px solid transparent',
                cursor:'pointer', padding:0,
                outline: i===active ? '2px solid rgba(255,255,255,0.3)' : 'none',
                outlineOffset:2, transition:'all 0.2s' }} />
          ))}
        </div>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:8, textAlign:'center' }}>{COLORS[active].label}</p>
      </div>
      {/* Scroll indicator */}
      <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', zIndex:3, textAlign:'center' }}>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', letterSpacing:'0.1em', marginBottom:8 }}>SCROLL</div>
        <div style={{ width:1, height:48, background:'linear-gradient(to bottom,rgba(255,255,255,0.35),transparent)', margin:'0 auto' }} />
      </div>
    </section>
  );
}
