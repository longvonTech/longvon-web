'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  NAV_EN,
  NAV_ZH,
  getAlternateLocalePath,
  getLocaleFromPath,
} from '../lib/i18n-routes';

function isActive(pathname: string, href: string) {
  if (href === '/' || href === '/en') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function GlobalNav() {
  const pathname = usePathname() || '/';
  const locale = getLocaleFromPath(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (pathname.startsWith('/admin')) return null;

  const links = locale === 'en' ? NAV_EN : NAV_ZH;
  const homeHref = locale === 'en' ? '/en' : '/';
  const switchTo = locale === 'en' ? 'zh' : 'en';
  const switchHref = getAlternateLocalePath(pathname, switchTo);
  const switchLabel = locale === 'en' ? '中文' : 'EN';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E5E7EB',
        transition: 'all 0.3s ease',
      }}
    >
      <nav
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 20px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <Link href={homeHref} className="nav-logo" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <img
            src="/images/longvon-logo.png"
            alt="LONGVON"
            style={{ height: 40, width: 'auto', objectFit: 'contain', display: 'block' }}
          />
        </Link>

        <ul className="desktop-nav" style={{ display: 'flex', gap: 16, listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
          {links.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`nav-link${isActive(pathname, item.href) ? ' nav-link-active' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={switchHref}
              className="nav-lang"
              hrefLang={switchTo === 'en' ? 'en' : 'zh-CN'}
              aria-label={locale === 'en' ? 'Switch to Chinese' : 'Switch to English'}
            >
              {switchLabel}
            </Link>
          </li>
        </ul>

        <div className="mobile-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href={switchHref} className="nav-lang mobile-lang" hrefLang={switchTo === 'en' ? 'en' : 'zh-CN'}>
            {switchLabel}
          </Link>
          <button
            className="mobile-menu-btn nav-icon-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            aria-label={locale === 'en' ? 'Open menu' : '打开菜单'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <div style={{ width: 22, height: 2, background: '#374151', marginBottom: 5 }} />
            <div style={{ width: 22, height: 2, background: '#374151', marginBottom: 5 }} />
            <div style={{ width: 22, height: 2, background: '#374151' }} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #E5E7EB', padding: '12px 20px 20px' }}>
          {links.map((item) => (
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
          transition: transform 0.12s ease, background 0.12s ease, color 0.12s ease;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        .nav-link:hover { color: #374151; background: #F9FAFB; }
        .nav-link:active { transform: scale(0.94); background: #E5E7EB; color: #111827; }
        .nav-link-active { color: #2563EB; font-weight: 600; }
        .nav-lang {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          padding: 6px 12px;
          font-size: 13px;
          font-weight: 600;
          color: #2563EB;
          border: 1px solid #BFDBFE;
          border-radius: 980px;
          background: #EFF6FF;
          white-space: nowrap;
        }
        .nav-lang:hover { background: #DBEAFE; }
        .nav-logo {
          border-radius: 8px;
          transition: transform 0.12s ease, opacity 0.12s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .nav-logo:active { transform: scale(0.96); opacity: 0.85; }
        .nav-icon-btn:active { transform: scale(0.92); opacity: 0.7; }
        .nav-mobile-link {
          display: block;
          padding: 12px 8px;
          font-size: 16px;
          color: #374151;
          font-weight: 500;
          border-bottom: 1px solid #F3F4F6;
          border-radius: 8px;
        }
        .nav-mobile-link-active { color: #2563EB; font-weight: 600; }
        .mobile-nav-actions { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-actions { display: flex !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-lang { display: none !important; }
        }
      `}</style>
    </header>
  );
}
