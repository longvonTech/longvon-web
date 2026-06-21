'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminImagesPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [token, setToken] = useState('');
  const [uploading, setUploading] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [cache, setCache] = useState<Record<string,string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const slotRef = useRef('');

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (!t) { router.push('/admin/login'); return; }
    setToken(t);
    fetch('/api/admin/images', { headers: { 'x-admin-token': t } })
      .then(r => r.status === 401 ? router.push('/admin/login') : r.json())
      .then(d => d && setData(d));
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !slotRef.current) return;
    e.target.value = '';
    const id = slotRef.current;
    setUploading(id); setResult(null);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`/api/admin/images/${id}/upload`, { method: 'POST', headers: { 'x-admin-token': token }, body: form });
      const json = await res.json();
      setResult({ id, success: res.ok, message: json.message ?? (res.ok ? '上传成功' : '上传失败') });
      if (res.ok) setCache(p => ({ ...p, [id]: `?t=${Date.now()}` }));
    } catch { setResult({ id, success: false, message: '网络错误' }); }
    finally { setUploading(null); }
  }

  if (!data) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><p style={{ color:'#6E6E73' }}>加载中...</p></div>;

  return (
    <div style={{ minHeight:'100vh', background:'#F5F5F7' }}>
      <header style={{ background:'#fff', borderBottom:'1px solid #E5E5EA', padding:'0 32px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ fontWeight:700, fontSize:17, color:'#1D1D1F' }}>MATEYOU</span>
          <span style={{ fontSize:13, color:'#6E6E73' }}>图片管理后台</span>
        </div>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <span style={{ fontSize:13, color:'#6E6E73' }}>共 {data.total} 张</span>
          <a href="/" style={{ fontSize:13, color:'#6E6E73' }} target="_blank">查看网站</a>
          <button onClick={() => { localStorage.removeItem('admin_token'); router.push('/admin/login'); }}
            style={{ fontSize:13, color:'#6E6E73', background:'none', border:'none', cursor:'pointer' }}>退出</button>
        </div>
      </header>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 24px' }}>
        {result && (
          <div style={{ padding:'14px 20px', borderRadius:12, marginBottom:24, background: result.success ? '#F0FFF4' : '#FFF2F2', border:`1px solid ${result.success ? '#86EFAC' : '#FCA5A5'}`, color: result.success ? '#166534' : '#991B1B', fontSize:14, display:'flex', justifyContent:'space-between' }}>
            <span>{result.success ? '✅' : '❌'} {result.message}</span>
            <button onClick={() => setResult(null)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18 }}>×</button>
          </div>
        )}

        <div style={{ background:'#EFF4FF', borderRadius:12, padding:'16px 20px', marginBottom:32, fontSize:13, color:'#1e40af' }}>
          💡 点击「上传替换」选择新图片，上传后立即在网站生效。支持 JPG / PNG / WebP，最大 10MB。
        </div>

        {Object.entries(data.byPage as Record<string, any[]>).map(([page, slots]) => (
          <div key={page} style={{ marginBottom:48 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <h2 style={{ fontSize:20, fontWeight:700, color:'#1D1D1F' }}>{page}</h2>
              <span style={{ fontSize:12, background:'#E5E5EA', color:'#6E6E73', padding:'3px 10px', borderRadius:20 }}>{slots.length} 张</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:16 }}>
              {slots.map((slot: any) => (
                <div key={slot.id} style={{ background:'#fff', borderRadius:16, overflow:'hidden', border: uploading === slot.id ? '2px solid #0066CC' : '1px solid #E5E5EA' }}>
                  <div style={{ position:'relative', height:200, background:'#F5F5F7' }}>
                    <img src={`/${slot.path}${cache[slot.id] ?? ''}`} alt={slot.name}
                      style={{ width:'100%', height:'100%', objectFit:'contain', padding:16 }}
                      onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                    {uploading === slot.id && (
                      <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.85)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <span style={{ fontSize:13, color:'#0066CC', fontWeight:500 }}>上传中...</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding:'16px 20px' }}>
                    <div style={{ fontSize:15, fontWeight:600, color:'#1D1D1F', marginBottom:4 }}>{slot.name}</div>
                    <div style={{ fontSize:12, color:'#6E6E73', marginBottom:4 }}>📍 {slot.section}</div>
                    <div style={{ fontSize:12, color:'#AEAEB2', marginBottom:8 }}>建议：{slot.recommendedSize}</div>
                    <div style={{ fontSize:11, color:'#AEAEB2', marginBottom:14, fontFamily:'monospace', wordBreak:'break-all' }}>/{slot.path}</div>
                    <button onClick={() => { slotRef.current = slot.id; fileRef.current?.click(); }} disabled={uploading === slot.id}
                      style={{ width:'100%', padding:10, background: uploading === slot.id ? '#F5F5F7' : '#0066CC', color: uploading === slot.id ? '#AEAEB2' : '#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor: uploading === slot.id ? 'not-allowed' : 'pointer' }}>
                      {uploading === slot.id ? '上传中...' : '📤 上传替换'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display:'none' }} onChange={handleFile} />
    </div>
  );
}
