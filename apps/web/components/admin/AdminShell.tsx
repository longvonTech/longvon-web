'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const TABS = [
  { href: '/admin/images', label: '页面图片' },
  { href: '/admin/news', label: '企业动态' },
];

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F7' }}>
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #E5E5EA',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 17, color: '#1D1D1F' }}>MATEYOU</span>
            <span style={{ fontSize: 13, color: '#6E6E73' }}>内容管理后台</span>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <a href="/" style={{ fontSize: 13, color: '#6E6E73' }} target="_blank" rel="noreferrer">查看网站</a>
            <button
              onClick={() => { localStorage.removeItem('admin_token'); router.push('/admin/login'); }}
              style={{ fontSize: 13, color: '#6E6E73', background: 'none', border: 'none', cursor: 'pointer' }}
              type="button"
            >
              退出
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingBottom: 12 }}>
          {TABS.map(tab => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  color: active ? '#0066CC' : '#6E6E73',
                  background: active ? '#EFF4FF' : 'transparent',
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1D1D1F', margin: '0 0 4px' }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 14, color: '#6E6E73', margin: 0 }}>{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
