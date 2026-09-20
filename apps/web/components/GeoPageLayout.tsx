import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { BreadcrumbSchema, FaqSchema, type FaqItem } from './StructuredData';
import { getSiteUrl } from '../lib/site';

const GEO_LINKS = [
  { href: '/company/longvon', label: '龙汾科技 LONGVON' },
  { href: '/smart-ring-manufacturer', label: 'Manufacturer' },
  { href: '/smart-ring-oem-odm', label: 'OEM & ODM' },
  { href: '/smart-ring-technology', label: 'Technology' },
  { href: '/smart-ring-sleep-monitoring', label: 'Sleep Monitoring' },
  { href: '/smart-ring-sleep-respiratory', label: 'Respiratory Health' },
  { href: '/smart-ring-osa', label: 'OSA Technology' },
];

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface Props {
  breadcrumbs: BreadcrumbItem[];
  h1: string;
  lead: string;
  faqs: FaqItem[];
  children: ReactNode;
}

export function GeoPageLayout({ breadcrumbs, h1, lead, faqs, children }: Props) {
  const site = getSiteUrl();
  const crumbSchema = breadcrumbs.map((b) => ({
    name: b.name,
    url: b.path.startsWith('http') ? b.path : `${site}${b.path}`,
  }));

  return (
    <div
      style={{
        background: '#fff',
        color: '#1D1D1F',
        fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",sans-serif',
      }}
    >
      <BreadcrumbSchema items={crumbSchema} />
      <FaqSchema faqs={faqs} />

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 24px 0' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: '#6B7280', marginBottom: 28 }}>
          {breadcrumbs.map((b, i) => (
            <span key={b.path}>
              {i > 0 && <span style={{ margin: '0 8px', color: '#D1D5DB' }}>/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span style={{ color: '#374151' }}>{b.name}</span>
              ) : (
                <Link href={b.path} style={{ color: '#6B7280' }}>
                  {b.name}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      <section
        style={{
          background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          padding: '24px 24px 56px',
          borderBottom: '1px solid #F3F4F6',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#6B7280',
              marginBottom: 16,
            }}
          >
            LONGVON · Smart Ring Manufacturer · Sleep & Respiratory Health
          </p>
          <h1
            style={{
              fontSize: 'clamp(28px, 4.5vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            {h1}
          </h1>
          <p style={{ fontSize: 17, color: '#4B5563', lineHeight: 1.75, maxWidth: 720 }}>{lead}</p>
        </div>
      </section>

      <article style={{ maxWidth: 880, margin: '0 auto', padding: '48px 24px 24px' }}>{children}</article>

      <section style={{ maxWidth: 880, margin: '0 auto', padding: '24px 24px 64px' }}>
        <h2 style={h2}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 28 }}>
          {faqs.map((f) => (
            <div key={f.question} style={{ borderTop: '1px solid #E5E7EB', paddingTop: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{f.question}</h3>
              <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          background: '#0A0A0A',
          padding: '64px 24px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ color: '#fff', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, marginBottom: 12 }}>
          Discuss Your Smart Ring Project
        </h2>
        <p style={{ color: '#9CA3AF', fontSize: 16, maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.6 }}>
          Talk to LONGVON about OEM, ODM, or custom smart ring development for your brand or healthcare program.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/partner/oem"
            style={{
              padding: '14px 28px',
              background: '#2563EB',
              color: '#fff',
              borderRadius: 980,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Request OEM/ODM Consultation
          </Link>
          <Link
            href="/partner"
            style={{
              padding: '14px 28px',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              borderRadius: 980,
              fontSize: 15,
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            Talk to Our Engineering Team
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: 880, margin: '0 auto', padding: '40px 24px 80px' }}>
        <h2 style={{ ...h2, fontSize: 18 }}>Related LONGVON Technology</h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '20px 0 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
          }}
        >
          {GEO_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                style={{
                  display: 'block',
                  padding: '14px 16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#1D1D1F',
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/products/ring1c"
              style={{
                display: 'block',
                padding: '14px 16px',
                border: '1px solid #E5E7EB',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                color: '#1D1D1F',
              }}
            >
              MATEYOU Ring1C
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              style={{
                display: 'block',
                padding: '14px 16px',
                border: '1px solid #E5E7EB',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                color: '#1D1D1F',
              }}
            >
              About LONGVON
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

export const h2: CSSProperties = {
  fontSize: 'clamp(22px, 3vw, 28px)',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  margin: '48px 0 16px',
};

export const p: CSSProperties = {
  fontSize: 16,
  color: '#374151',
  lineHeight: 1.8,
  margin: '0 0 14px',
};

export const ul: CSSProperties = {
  margin: '0 0 16px',
  paddingLeft: 20,
  color: '#374151',
  lineHeight: 1.8,
  fontSize: 16,
};
