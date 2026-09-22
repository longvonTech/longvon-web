import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteUrl } from '../../../lib/site';
import { BRAND_RELATION_EN, ENTITY_STATEMENT_EN, LEGAL_NAME_EN, LEGAL_NAME_ZH } from '../../../lib/geo';
import { siteAlternates } from '../../../lib/i18n-routes';

const site = getSiteUrl();

export const metadata: Metadata = {
  title: { absolute: 'About LONGVON | Smart Ring Technology Manufacturer' },
  description: `${ENTITY_STATEMENT_EN} ${BRAND_RELATION_EN}`,
  alternates: siteAlternates(site, '/about', 'en'),
  openGraph: {
    title: 'About LONGVON',
    description: ENTITY_STATEMENT_EN,
    url: `${site}/en/about`,
    locale: 'en_US',
    type: 'website',
  },
};

export default function EnglishAboutPage() {
  return (
    <div style={{ background: '#fff', color: '#1D1D1F' }}>
      <section style={{ background: '#000', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', color: '#6B7280', marginBottom: 20 }}>
            ABOUT LONGVON
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, color: '#fff', marginBottom: 20 }}>
            Smart ring technology manufacturer
            <br />
            &amp; OEM/ODM provider
          </h1>
          <p style={{ fontSize: 17, color: '#9CA3AF', lineHeight: 1.75 }}>{ENTITY_STATEMENT_EN}</p>
        </div>
      </section>

      <section style={{ padding: '72px 24px', maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Company</h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 14 }}>
          <strong>{LEGAL_NAME_EN}</strong> ({LEGAL_NAME_ZH}) was founded in 2017. The company is recognized as a
          National High-Tech Enterprise and a Shenzhen Specialized &amp; Innovative SME (as stated on company materials).
        </p>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8, marginBottom: 14 }}>{BRAND_RELATION_EN}</p>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8 }}>
          Full entity page:{' '}
          <Link href="/en/company/longvon" style={{ color: '#2563EB' }}>
            /en/company/longvon
          </Link>
        </p>
      </section>

      <section style={{ background: '#F8FAFC', padding: '64px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Focus areas</h2>
          <ul style={{ color: '#374151', lineHeight: 1.9, fontSize: 16 }}>
            <li>Smart ring hardware, firmware, apps, SDKs, and cloud APIs</li>
            <li>OEM manufacturing and ODM / custom development</li>
            <li>Sleep monitoring, respiratory health monitoring, OSA-related monitoring</li>
            <li>Healthcare wearable technology partnerships</li>
          </ul>
          <p style={{ marginTop: 28 }}>
            <Link href="/en/partner" style={{ color: '#2563EB', fontWeight: 600 }}>
              Partner with LONGVON →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
