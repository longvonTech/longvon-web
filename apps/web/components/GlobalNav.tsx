'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '/products/ring1c', label: '产品介绍' },
  { href: '/assessment', label: '健康评估' },
  { href: '/knowledge', label: '健康知识库' },
  { href: '/news', label: '企业动态' },
  { href: '/partner', label: '商业合作' },
  { href: '/about', label: '关于我们' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

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
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #E5E7EB',
      transition: 'all 0.3s ease',
    }}>
      <nav style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <img src="/images/longvon-logo.png" alt="LONGVON"
            style={{ height: 40, width: 'auto', objectFit: 'contain', display: 'block' }} />
        </Link>

        <ul className="desktop-nav" style={{ display: 'flex', gap: 20, listStyle: 'none', margin: 0, padding: 0 }}>
          {NAV_LINKS.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`nav-link${isActive(pathname, item.href) ? ' nav-link-active' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button className="mobile-menu-btn nav-icon-btn" onClick={() => setMenuOpen(!menuOpen)}
          type="button"
          aria-label="打开菜单"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <div style={{ width: 22, height: 2, background: '#374151', marginBottom: 5 }} />
          <div style={{ width: 22, height: 2, background: '#374151', marginBottom: 5 }} />
          <div style={{ width: 22, height: 2, background: '#374151' }} />
        </button>
      </nav>

      {menuOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #E5E7EB', padding: '12px 20px 20px' }}>
          {NAV_LINKS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`nav-mobile-link${isActive(pathname, item.href) ? ' nav-mobile-link-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .nav-link {
          display: inline-block;
          padding: 8px 6px;
          font-size: 15px;
          color: #6B7280;
          font-weight: 500;
          white-space: nowrap;
          border-radius: 8px;
          transition: transform 0.12s ease, background 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        .nav-link:hover {
          color: #374151;
          background: #F9FAFB;
        }
        .nav-link:active {
          transform: scale(0.94);
          background: #E5E7EB;
          color: #111827;
        }
        .nav-link-active {
          color: #2563EB;
          font-weight: 600;
        }
        .nav-logo {
          border-radius: 8px;
          transition: transform 0.12s ease, opacity 0.12s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .nav-logo:active {
          transform: scale(0.96);
          opacity: 0.85;
        }
        .nav-icon-btn:active {
          transform: scale(0.92);
          opacity: 0.7;
        }
        .nav-mobile-link {
          display: block;
          padding: 12px 8px;
          font-size: 16px;
          color: #374151;
          font-weight: 500;
          border-bottom: 1px solid #F3F4F6;
          border-radius: 8px;
          transition: transform 0.12s ease, background 0.12s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .nav-mobile-link:active {
          transform: scale(0.98);
          background: #F3F4F6;
        }
        .nav-mobile-link-active {
          color: #2563EB;
          font-weight: 600;
        }
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
