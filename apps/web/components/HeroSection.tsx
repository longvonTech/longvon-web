'use client';
import { useState } from 'react';
import Link from 'next/link';

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
      {/* 背景图 */}
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
      <div style={{ position:'relative', zIndex:2, maxWidth:1100, margin:'0 auto', padding:'clamp(80px,12vh,120px) clamp(20px,4vw,48px) clamp(60px,10vh,100px)', width:'100%', boxSizing:'border-box' }}>
        <p style={{ fontSize:13, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', marginBottom:24 }}>
          Ring1C · Personal Health Intelligence System
        </p>
        <h1 style={{ fontSize:'clamp(36px,7vw,88px)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.02, color:'#fff', marginBottom:28, maxWidth:640 }}>
          把关爱，<br /><span style={{ color:'#60A5FA' }}>戴在手上</span>
        </h1>
        <p style={{ fontSize:'clamp(15px,2vw,20px)', color:'rgba(255,255,255,0.72)', lineHeight:1.7, maxWidth:480, marginBottom:'clamp(28px,5vw,40px)' }}>
          MATEYOU Ring1C 智能健康戒指——专为睡眠呼吸暂停筛查和睡眠质量监测而生，24小时守护你和家人的健康。
        </p>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:28 }}>
          <Link href="/partner" style={{ padding:'15px 36px', background:'#fff', color:'#1D1D1F', borderRadius:980, fontSize:16, fontWeight:700 }}>了解合作方案</Link>
          <Link href="/products/ring1c" style={{ padding:'15px 36px', background:'rgba(255,255,255,0.12)', color:'#fff', borderRadius:980, fontSize:16, fontWeight:600, border:'1px solid rgba(255,255,255,0.3)' }}>产品详情</Link>
        </div>
        {/* 配色切换器 — 横排，按钮下方 */}
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.45)' }}>配色</span>
          {COLORS.map((c, i) => (
            <button key={c.id} onClick={() => setActive(i)} aria-label={c.label}
              style={{ width:20, height:20, borderRadius:'50%', background:c.hex,
                border: i===active ? '2px solid #fff' : '2px solid rgba(255,255,255,0.25)',
                cursor:'pointer', padding:0,
                outline: i===active ? '2px solid rgba(255,255,255,0.35)' : 'none',
                outlineOffset:2, transition:'all 0.2s', flexShrink:0 }} />
          ))}
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>{COLORS[active].label}</span>
        </div>
        <p style={{ marginTop:16, fontSize:12, color:'rgba(255,255,255,0.3)' }}>消费级健康监测设备 · 结果仅供参考 · 非医疗诊断</p>
      </div>
      {/* Scroll indicator */}
      <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', zIndex:3, textAlign:'center' }}>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', letterSpacing:'0.1em', marginBottom:8 }}>SCROLL</div>
        <div style={{ width:1, height:48, background:'linear-gradient(to bottom,rgba(255,255,255,0.35),transparent)', margin:'0 auto' }} />
      </div>
    </section>
  );
}
