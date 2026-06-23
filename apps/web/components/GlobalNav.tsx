'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function GlobalNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (pathname.startsWith('/admin')) return null;

  return (
    <header style={{
      position:'sticky', top:0, zIndex:100,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.97)',
      backdropFilter:'blur(12px)',
      borderBottom:'1px solid #E5E7EB',
      transition:'all 0.3s ease',
    }}>
      <nav style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
          <img src="/images/longvon-logo.png" alt="LONGVON"
            style={{ height:40, width:'auto', objectFit:'contain', display:'block' }} />
        </Link>

        <ul className="desktop-nav" style={{ display:'flex', gap:28, listStyle:'none', margin:0, padding:0 }}>
          {[
            { href:'/products/ring1c', label:'产品介绍' },
            { href:'/assessment', label:'健康评估' },
            { href:'/knowledge', label:'健康知识库' },
            { href:'/partner', label:'商业合作' },
          ].map(item => (
            <li key={item.href}>
              <Link style={{ fontSize:15, color:'#6B7280', fontWeight:500, whiteSpace:'nowrap' }} href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <Link href="/assessment" style={{ padding:'8px 18px', background:'#2563EB', color:'#fff', borderRadius:8, fontSize:14, fontWeight:600, whiteSpace:'nowrap' }}>
            健康评估
          </Link>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}
            style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <div style={{ width:22, height:2, background:'#374151', marginBottom:5 }} />
            <div style={{ width:22, height:2, background:'#374151', marginBottom:5 }} />
            <div style={{ width:22, height:2, background:'#374151' }} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ background:'#fff', borderTop:'1px solid #E5E7EB', padding:'12px 20px 20px' }}>
          {[
            { href:'/products/ring1c', label:'产品介绍' },
            { href:'/assessment', label:'健康评估' },
            { href:'/knowledge', label:'健康知识库' },
            { href:'/partner', label:'商业合作' },
          ].map(item => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
              style={{ display:'block', padding:'12px 0', fontSize:16, color:'#374151', fontWeight:500, borderBottom:'1px solid #F3F4F6' }}>
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}
