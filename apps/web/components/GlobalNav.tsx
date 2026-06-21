'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function GlobalNav() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return (
    <header style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(8px)', borderBottom:'1px solid var(--color-border)' }}>
      <nav style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/"><img src="/images/longvon-logo.png" alt="LONGVON" style={{ height:48, width:'auto', objectFit:'contain', display:'block', maxWidth:180 }} /></Link>
        <ul style={{ display:'flex', gap:32, listStyle:'none', margin:0, padding:0 }} className="hidden md:flex">
          <li><Link style={{ fontSize:15, color:'var(--color-text-secondary)', fontWeight:500 }} href="/products/ring1c">产品介绍</Link></li>
          <li><Link style={{ fontSize:15, color:'var(--color-text-secondary)', fontWeight:500 }} href="/assessment">健康评估</Link></li>
          <li><Link style={{ fontSize:15, color:'var(--color-text-secondary)', fontWeight:500 }} href="/knowledge">健康知识库</Link></li>
          <li><Link style={{ fontSize:15, color:'var(--color-text-secondary)', fontWeight:500 }} href="/partner">商业合作</Link></li>
        </ul>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <Link style={{ padding:'8px 20px', background:'var(--color-brand)', color:'#fff', borderRadius:8, fontSize:14, fontWeight:500 }} href="/assessment">免费自评</Link>
        </div>
      </nav>
    </header>
  );
}
