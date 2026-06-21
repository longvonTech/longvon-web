'use client';
import { useState } from 'react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!password) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/images/auth/verify', {
        method: 'POST',
        headers: { 'x-admin-token': password },
      });
      if (res.ok) {
        localStorage.setItem('admin_token', password);
        window.location.href = '/admin/images';
      } else {
        setError('密码错误，请重试');
      }
    } catch (e) {
      setError('网络错误：' + String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F5F5F7', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:20, padding:'48px 40px', width:360, boxShadow:'0 4px 40px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🔐</div>
          <h1 style={{ fontSize:22, fontWeight:700, color:'#1D1D1F', margin:0 }}>图片管理后台</h1>
          <p style={{ fontSize:14, color:'#6E6E73', marginTop:8 }}>MATEYOU · 管理员入口</p>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:13, fontWeight:500, color:'#1D1D1F', display:'block', marginBottom:8 }}>管理员密码</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="请输入密码"
            style={{ width:'100%', padding:'12px 16px', border:'1.5px solid #E5E5EA', borderRadius:12, fontSize:15, outline:'none', boxSizing:'border-box' }}
          />
        </div>
        {error && (
          <div style={{ padding:'10px 14px', background:'#FFF2F2', borderRadius:10, marginBottom:16, fontSize:13, color:'#D32F2F' }}>
            {error}
          </div>
        )}
        <button
          onClick={handleLogin}
          disabled={loading || !password}
          style={{ width:'100%', padding:13, background: !password || loading ? '#C7C7CC' : '#1D1D1F', color:'#fff', borderRadius:12, fontSize:15, fontWeight:600, border:'none', cursor:'pointer' }}
        >
          {loading ? '验证中...' : '登录'}
        </button>
      </div>
    </div>
  );
}
