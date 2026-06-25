'use client';
import { useState } from 'react';
import Link from 'next/link';

const SIZES = [
  { us:'US 6',  inner:16.30, circ:51.2, mat:'XS' },
  { us:'US 7',  inner:17.00, circ:53.4, mat:'S'  },
  { us:'US 8',  inner:17.70, circ:55.6, mat:'S'  },
  { us:'US 9',  inner:18.70, circ:58.7, mat:'M'  },
  { us:'US 10', inner:19.70, circ:61.9, mat:'M'  },
  { us:'US 11', inner:20.30, circ:63.8, mat:'L'  },
  { us:'US 12', inner:21.00, circ:66.0, mat:'L'  },
  { us:'US 13', inner:21.70, circ:68.2, mat:'XL' },
];

const STEPS = [
  { n:1, en:'Prepare a paper strip', zh:'准备纸条',     detail:'剪一条约10cm长、0.5cm宽的纸条，确保平整光滑。' },
  { n:2, en:'Wrap around finger',    zh:'绕住手指',     detail:'将纸条绕无名指一圈，松紧适度，以能轻松转动为准。' },
  { n:3, en:'Mark the overlap',      zh:'标记重叠点',   detail:'在纸条重叠处用笔做好标记，取下纸条。' },
  { n:4, en:'Measure the length',    zh:'量出长度',     detail:'用尺子量出纸条从起点到标记点的长度（mm）。' },
  { n:5, en:'Match to size chart',   zh:'对照尺寸表',   detail:'将测量长度除以3.14，得出内径（mm），对照下方尺寸表选择。' },
];

export function SizeGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [showGiftQR, setShowGiftQR] = useState(false);

  return (
    <section style={{ background:'#000', padding:'120px 24px' }}>
      <div style={{ maxWidth:960, margin:'0 auto' }}>

        {/* 标题 */}
        <div style={{ textAlign:'center', marginBottom:72 }}>
          <p style={{ fontSize:14, color:'#86868B', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:20 }}>Ring Size</p>
          <h2 style={{ fontSize:'clamp(36px,5vw,60px)', fontWeight:700, letterSpacing:'-0.025em', marginBottom:16 }}>
            找到适合你的尺寸。
          </h2>
          <p style={{ fontSize:18, color:'#86868B' }}>在家量测，精准选码</p>
        </div>

        {/* 5步骤量测 */}
        <div style={{ background:'#111', borderRadius:28, padding:'48px', marginBottom:24 }}>
          <h3 style={{ fontSize:22, fontWeight:700, marginBottom:32, textAlign:'center' }}>自行量测方法</h3>

          {/* 步骤导航 */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8, marginBottom:40 }}>
            {STEPS.map((s, i) => (
              <button key={i} onClick={() => setActiveStep(i)}
                style={{ cursor:'pointer', padding:'16px 8px', borderRadius:16,
                  background: i===activeStep ? 'rgba(10,132,255,0.15)' : 'rgba(255,255,255,0.04)',
                  border: i===activeStep ? '1px solid rgba(10,132,255,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  transition:'all 0.2s' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background: i===activeStep ? '#0A84FF' : 'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', fontSize:15, fontWeight:700, color: i===activeStep ? '#fff' : '#86868B', transition:'all 0.2s' }}>
                  {s.n}
                </div>
                <div style={{ fontSize:12, color: i===activeStep ? '#fff' : '#86868B', lineHeight:1.4, textAlign:'center' }}>{s.zh}</div>
              </button>
            ))}
          </div>

          {/* 步骤详情 */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:32, alignItems:'center' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'#0A84FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:700, flexShrink:0 }}>
                  {STEPS[activeStep].n}
                </div>
                <h4 style={{ fontSize:22, fontWeight:700 }}>{STEPS[activeStep].zh}</h4>
              </div>
              <p style={{ fontSize:17, color:'#86868B', lineHeight:1.7 }}>{STEPS[activeStep].detail}</p>
              {activeStep === 4 && (
                <div style={{ marginTop:20, background:'rgba(10,132,255,0.08)', borderRadius:14, padding:'16px 20px', border:'1px solid rgba(10,132,255,0.15)' }}>
                  <div style={{ fontSize:14, color:'#0A84FF', fontWeight:600, marginBottom:6 }}>计算公式</div>
                  <div style={{ fontSize:18, color:'#fff', fontWeight:700, fontFamily:'monospace' }}>测量长度（mm）÷ 3.14 = 内径（mm）</div>
                </div>
              )}
              <p style={{ fontSize:13, color:'#555', marginTop:16 }}>💡 建议下午量测，若在两个尺码之间请选大一号</p>
            </div>
            <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:20, height:200, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:40, marginBottom:8 }}>
                  {['📄','🫱','✏️','📏','📊'][activeStep]}
                </div>
                <div style={{ fontSize:12, color:'#444' }}>步骤{activeStep+1}示意图</div>
                <div style={{ fontSize:11, color:'#333', marginTop:4, fontFamily:'monospace' }}>ring1c-size-step-{activeStep+1}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 尺寸选择器 */}
        <div style={{ background:'#111', borderRadius:28, padding:'48px', marginBottom:24 }}>
          <h3 style={{ fontSize:22, fontWeight:700, marginBottom:8 }}>可选尺寸</h3>
          <p style={{ fontSize:15, color:'#86868B', marginBottom:32 }}>点击选择你的尺码，查看对应内径数据</p>

          <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:28 }}>
            {SIZES.map((s, i) => (
              <button key={i} onClick={() => setSelectedSize(i)}
                style={{ padding:'12px 20px', borderRadius:980, fontSize:15, fontWeight:600, cursor:'pointer', border:'none', transition:'all 0.2s',
                  background: i===selectedSize ? '#0A84FF' : 'rgba(255,255,255,0.08)',
                  color: i===selectedSize ? '#fff' : '#86868B' }}>
                {s.us}
              </button>
            ))}
          </div>

          {/* 选中尺寸详情 */}
          <div style={{ background:'rgba(10,132,255,0.08)', borderRadius:18, padding:'24px 28px', border:'1px solid rgba(10,132,255,0.2)', display:'flex', flexWrap:'wrap', gap:32, alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:14, color:'#86868B', marginBottom:8 }}>您选择了 {SIZES[selectedSize].us}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:24 }}>
                <div>
                  <span style={{ fontSize:13, color:'#86868B' }}>内径  </span>
                  <span style={{ fontSize:22, fontWeight:700, color:'#0A84FF' }}>{SIZES[selectedSize].inner} mm</span>
                </div>
                <div>
                  <span style={{ fontSize:13, color:'#86868B' }}>周长  </span>
                  <span style={{ fontSize:22, fontWeight:700, color:'#fff' }}>{SIZES[selectedSize].circ} mm</span>
                </div>
              </div>
            </div>
            <button onClick={() => setShowQR(true)}
              style={{ padding:'14px 32px', background:'#0A84FF', color:'#fff', borderRadius:980, fontSize:16, fontWeight:600, whiteSpace:'nowrap', border:'none', cursor:'pointer' }}>
              立即购买
            </button>
          </div>
        </div>

        {/* 礼品卡指模套装 */}
        <div style={{ background:'#111', borderRadius:28, overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))' }}>
            {/* 左侧文字 */}
            <div style={{ padding:'48px' }}>
              <p style={{ fontSize:12, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'#86868B', marginBottom:20 }}>COMPLIMENTARY</p>
              <h3 style={{ fontSize:'clamp(24px,3vw,36px)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:16 }}>
                礼品卡指模套装
              </h3>
              <p style={{ fontSize:16, color:'#86868B', lineHeight:1.7, marginBottom:28 }}>
                每个Ring1C订单随附免费礼品卡，内含全套塑胶指模（US6至US13）。收到后请逐一试戴，找到最贴合的尺寸。若与所购尺码不符，可免费换货一次，运费由我们承担。如需再次购买，联系客服即可领取50元优惠券，直接抵扣下单。也欢迎您将Ring1C推荐给身边的家人和朋友，把关爱一起分享。
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:32 }}>
                {[
                  { icon:'🔄', title:'尺寸不合适？', desc:'免费换货一次，运费由我们承担，无需担心' },
                  { icon:'🎁', title:'推荐给朋友', desc:'推荐成功后可领取50元优惠券，再次购买直接抵扣' },
                ].map(item => (
                  <div key={item.title} style={{ background:'rgba(255,255,255,0.04)', borderRadius:14, padding:'16px 20px', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>{item.icon} {item.title}</div>
                    <div style={{ fontSize:14, color:'#86868B' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowGiftQR(true)}
                style={{ display:'inline-block', padding:'14px 32px', background:'#fff', color:'#000', borderRadius:980, fontSize:15, fontWeight:700, border:'none', cursor:'pointer' }}>
                了解更多礼品卡详情
              </button>
            </div>
            {/* 右侧图片 */}
            <div style={{ background:'#1a0a0a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:360, padding:32, gap:0 }}>
              <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, width:'100%', flex:1, display:'flex', alignItems:'center', justifyContent:'center', border:'1px dashed rgba(255,255,255,0.1)', marginBottom:16 }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:48, marginBottom:8 }}>🎁</div>
                  <div style={{ fontSize:13, color:'#444' }}>礼品卡指模套装展示图</div>
                  <div style={{ fontSize:11, color:'#333', marginTop:4, fontFamily:'monospace' }}>ring1c-giftcard</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 邮寄流程 */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:2, marginTop:2 }}>
          {[
            { icon:'🛒', title:'选码下单',  desc:'选好颜色与尺码' },
            { icon:'✅', title:'审核确认',  desc:'24小时内完成' },
            { icon:'📦', title:'精品包装',  desc:'礼盒专属包装' },
            { icon:'🚚', title:'顺丰邮寄',  desc:'全程可追踪' },
          ].map((s, i) => (
            <div key={s.title} style={{ background:'#111', padding:'28px 20px', textAlign:'center',
              borderRadius: i===0 ? '0 0 0 28px' : i===3 ? '0 0 28px 0' : 0 }}>
              <div style={{ fontSize:28, marginBottom:12 }}>{s.icon}</div>
              <div style={{ fontSize:15, fontWeight:600, marginBottom:4 }}>{s.title}</div>
              <div style={{ fontSize:13, color:'#86868B' }}>{s.desc}</div>
            </div>
          ))}
        </div>

      </div>
      {/* 礼品卡二维码弹窗 */}
      {showGiftQR && (
        <div onClick={() => setShowGiftQR(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background:'#fff', borderRadius:28, padding:'40px 36px', textAlign:'center', maxWidth:320, width:'90%' }}>
            <div style={{ fontSize:22, fontWeight:700, color:'#1D1D1F', marginBottom:8 }}>礼品卡指模套装</div>
            <p style={{ fontSize:14, color:'#86868B', marginBottom:24, lineHeight:1.6 }}>使用微信扫描下方二维码<br />了解更多礼品卡详情</p>
            <img src="/images/giftcard-qrcode.jpg" alt="MATEYOU礼品卡" style={{ width:220, height:220, objectFit:'contain', borderRadius:12, marginBottom:16 }} />
            <p style={{ fontSize:13, color:'#86868B', marginBottom:24 }}>Ring1C · 免费指模套装</p>
            <button onClick={() => setShowGiftQR(false)} style={{ width:'100%', padding:'13px', background:'#F2F2F7', color:'#1D1D1F', border:'none', borderRadius:14, fontSize:15, fontWeight:600, cursor:'pointer' }}>
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 微信二维码弹窗 */}
      {showQR && (
        <div onClick={() => setShowQR(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background:'#fff', borderRadius:28, padding:'40px 36px', textAlign:'center', maxWidth:320, width:'90%' }}>
            <div style={{ fontSize:22, fontWeight:700, color:'#1D1D1F', marginBottom:8 }}>微信扫码购买</div>
            <p style={{ fontSize:14, color:'#86868B', marginBottom:24, lineHeight:1.6 }}>使用微信扫描下方二维码<br />进入 MATEYOU 小程序商城</p>
            <img src="/images/miniprogram-qrcode.png" alt="MATEYOU小程序商城" style={{ width:220, height:220, objectFit:'contain', borderRadius:12, marginBottom:16 }} />
            <p style={{ fontSize:13, color:'#86868B', marginBottom:24 }}>Ring1C · 智能健康戒指</p>
            <button onClick={() => setShowQR(false)} style={{ width:'100%', padding:'13px', background:'#F2F2F7', color:'#1D1D1F', border:'none', borderRadius:14, fontSize:15, fontWeight:600, cursor:'pointer' }}>
              关闭
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
