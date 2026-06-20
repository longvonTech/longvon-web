'use client';
import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { label: '产品介绍', href: '/products/ring1c' },
  { label: '健康评估', href: '/assessment' },
  { label: '健康知识库', href: '/knowledge' },
  { label: '商业合作', href: '/partner' },
];

export function GlobalNav() {
  const [open, setOpen] = useState(false);
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <nav style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '0 24px',
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 20, color: 'var(--color-brand)' }}>
          MATEYOU
        </Link>
        {/* 桌面端导航 */}
        <ul style={{ display: 'flex', gap: 32, listStyle: 'none', margin: 0, padding: 0 }}
          className="hidden md:flex">
          {NAV_LINKS.map(l => (
            <li key={l.href}>
              <Link href={l.href} style={{ fontSize: 15, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/assessment" style={{
            padding: '8px 20px', background: 'var(--color-brand)',
            color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 500,
          }}>
            免费自评
          </Link>
        </div>
      </nav>
    </header>
  );
}
