import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteUrl } from '../../../../lib/site';
import { ENTITY_STATEMENT_EN } from '../../../../lib/geo';
import { siteAlternates } from '../../../../lib/i18n-routes';

const site = getSiteUrl();

export const metadata: Metadata = {
  title: { absolute: 'OEM / ODM Inquiry | LONGVON' },
  description: `Contact LONGVON for smart ring OEM manufacturing and ODM/custom development. ${ENTITY_STATEMENT_EN}`,
  alternates: siteAlternates(site, '/partner/oem', 'en'),
};

export default function EnglishPartnerOemPage() {
  return (
    <main style={{ maxWidth: 720, margin: '60px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>OEM / ODM Inquiry</h1>
      <p style={{ color: '#4B5563', marginTop: 12, lineHeight: 1.75 }}>{ENTITY_STATEMENT_EN}</p>
      <p style={{ color: '#6B7280', marginTop: 12, lineHeight: 1.7 }}>
        Review capability details on the{' '}
        <Link href="/en/smart-ring-oem-odm" style={{ color: '#2563EB' }}>
          OEM &amp; ODM technology page
        </Link>
        , then submit an inquiry. The detailed intake form is currently available on the Chinese partner page and is
        reviewed by the LONGVON team for both Chinese and international requests.
      </p>
      <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Link
          href="/partner/oem"
          style={{
            padding: '14px 24px',
            background: '#2563EB',
            color: '#fff',
            borderRadius: 980,
            fontWeight: 600,
          }}
        >
          Open inquiry form
        </Link>
        <Link href="/en/company/longvon" style={{ padding: '14px 24px', color: '#2563EB', fontWeight: 600 }}>
          About LONGVON →
        </Link>
      </div>
    </main>
  );
}
