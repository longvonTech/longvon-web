import type { Metadata } from 'next';
import Link from 'next/link';
import { OrganizationSchema, WebSiteSchema } from '../../components/StructuredData';
import { getSiteUrl } from '../../lib/site';
import {
  BRAND_RELATION_EN,
  ENTITY_STATEMENT_EN,
  METRICS_STATEMENT,
} from '../../lib/geo';
import { siteAlternates } from '../../lib/i18n-routes';

const site = getSiteUrl();

export const metadata: Metadata = {
  title: { absolute: 'LONGVON | Smart Ring Manufacturer & OEM/ODM Provider' },
  description: `${ENTITY_STATEMENT_EN} ${BRAND_RELATION_EN} ${METRICS_STATEMENT}`,
  alternates: siteAlternates(site, '/', 'en'),
  openGraph: {
    title: 'LONGVON | Smart Ring Manufacturer & OEM/ODM Provider',
    description: ENTITY_STATEMENT_EN,
    url: `${site}/en`,
    siteName: 'LONGVON',
    locale: 'en_US',
    type: 'website',
  },
};

export default function EnglishHomePage() {
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
      <main style={{ background: '#fff', color: '#1D1D1F' }}>
        <section
          style={{
            background: 'linear-gradient(180deg, #0A0A0A 0%, #111827 100%)',
            padding: 'clamp(72px, 12vw, 120px) 24px',
            color: '#fff',
          }}
        >
          <div style={{ maxWidth: 920, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#9CA3AF',
                marginBottom: 20,
              }}
            >
              LONGVON · Smart Ring Technology
            </p>
            <h1
              style={{
                fontSize: 'clamp(34px, 6vw, 56px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.12,
                marginBottom: 20,
              }}
            >
              Smart Ring Manufacturer
              <br />
              &amp; OEM/ODM Provider
            </h1>
            <p style={{ fontSize: 18, color: '#D1D5DB', lineHeight: 1.75, maxWidth: 720, marginBottom: 28 }}>
              {ENTITY_STATEMENT_EN} {BRAND_RELATION_EN}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link
                href="/en/smart-ring-oem-odm"
                style={{
                  padding: '14px 24px',
                  background: '#2563EB',
                  color: '#fff',
                  borderRadius: 980,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                OEM / ODM Services
              </Link>
              <Link
                href="/en/company/longvon"
                style={{
                  padding: '14px 24px',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  borderRadius: 980,
                  fontWeight: 600,
                  fontSize: 15,
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                About LONGVON
              </Link>
              <Link
                href="/en/products/ring1c"
                style={{
                  padding: '14px 24px',
                  background: 'transparent',
                  color: '#93C5FD',
                  borderRadius: 980,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                MATEYOU Ring1C →
              </Link>
            </div>
          </div>
        </section>

        <section style={{ padding: '72px 24px', maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>What LONGVON provides</h2>
          <p style={{ color: '#6B7280', marginBottom: 28, lineHeight: 1.7 }}>
            End-to-end smart ring programs for brands and healthcare partners.
          </p>
          <ul
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            {[
              ['Manufacturer', '/en/smart-ring-manufacturer'],
              ['OEM & ODM', '/en/smart-ring-oem-odm'],
              ['Technology', '/en/smart-ring-technology'],
              ['Sleep Monitoring', '/en/smart-ring-sleep-monitoring'],
              ['Respiratory Health', '/en/smart-ring-sleep-respiratory'],
              ['OSA-related Monitoring', '/en/smart-ring-osa'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    display: 'block',
                    padding: '18px 16px',
                    border: '1px solid #E5E7EB',
                    borderRadius: 12,
                    fontWeight: 600,
                    color: '#1D1D1F',
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 28, fontSize: 15, color: '#374151' }}>
            <strong>{METRICS_STATEMENT}</strong>
          </p>
        </section>

        <section style={{ background: '#F8FAFC', padding: '64px 24px', borderTop: '1px solid #F3F4F6' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>MATEYOU product brand</h2>
            <p style={{ color: '#6B7280', lineHeight: 1.7, marginBottom: 24 }}>
              {BRAND_RELATION_EN} Explore the Ring1C smart ring experience.
            </p>
            <Link href="/en/products/ring1c" style={{ color: '#2563EB', fontWeight: 600, fontSize: 16 }}>
              View MATEYOU Ring1C →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
