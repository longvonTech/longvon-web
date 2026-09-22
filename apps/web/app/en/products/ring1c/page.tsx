import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteUrl } from '../../../../lib/site';
import { BRAND_RELATION_EN, ENTITY_STATEMENT_EN, METRICS_STATEMENT } from '../../../../lib/geo';
import { siteAlternates } from '../../../../lib/i18n-routes';

const site = getSiteUrl();

export const metadata: Metadata = {
  title: { absolute: 'MATEYOU Ring1C | Smart Ring by LONGVON' },
  description: `MATEYOU Ring1C is LONGVON's smart ring product brand experience. ${METRICS_STATEMENT} ${BRAND_RELATION_EN}`,
  alternates: siteAlternates(site, '/products/ring1c', 'en'),
};

export default function EnglishRing1cPage() {
  return (
    <main style={{ background: '#fff', color: '#1D1D1F' }}>
      <section style={{ padding: '80px 24px 40px', maxWidth: 900, margin: '0 auto' }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', color: '#9CA3AF', marginBottom: 16 }}>
          MATEYOU · PRODUCT BRAND
        </p>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
          MATEYOU Ring1C
        </h1>
        <p style={{ fontSize: 18, color: '#4B5563', lineHeight: 1.75, marginBottom: 20 }}>
          Ring1C is the smart ring product experience under the MATEYOU brand. {BRAND_RELATION_EN}
        </p>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.7, marginBottom: 28 }}>
          <strong>{METRICS_STATEMENT}</strong> Capabilities include sleep monitoring, heart-related signals, SpO₂,
          stress-related indicators, and OSA-related monitoring for health reference—not medical diagnosis.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link
            href="/en/company/longvon"
            style={{
              padding: '12px 22px',
              background: '#2563EB',
              color: '#fff',
              borderRadius: 980,
              fontWeight: 600,
            }}
          >
            About the manufacturer
          </Link>
          <Link href="/en/smart-ring-oem-odm" style={{ padding: '12px 22px', color: '#2563EB', fontWeight: 600 }}>
            OEM / ODM for your brand →
          </Link>
        </div>
      </section>

      <section style={{ padding: '24px 24px 80px', maxWidth: 900, margin: '0 auto' }}>
        <img
          src="/images/ring1c/Black.jpg"
          alt="MATEYOU Ring1C"
          style={{ width: '100%', maxWidth: 480, display: 'block', margin: '0 auto 40px', objectFit: 'contain' }}
        />
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Built by LONGVON</h2>
        <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.8 }}>
          {ENTITY_STATEMENT_EN} For B2B manufacturing and customization, see{' '}
          <Link href="/en/smart-ring-manufacturer" style={{ color: '#2563EB' }}>
            Smart Ring Manufacturer
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
