import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteUrl } from '../../../lib/site';
import { ENTITY_STATEMENT_EN } from '../../../lib/geo';
import { siteAlternates } from '../../../lib/i18n-routes';

const site = getSiteUrl();

export const metadata: Metadata = {
  title: { absolute: 'Partners | LONGVON Smart Ring OEM & Collaboration' },
  description: `Partner with LONGVON for smart ring OEM/ODM, healthcare programs, and brand collaboration. ${ENTITY_STATEMENT_EN}`,
  alternates: siteAlternates(site, '/partner', 'en'),
};

const TYPES = [
  {
    href: '/en/partner/oem',
    name: 'OEM / ODM',
    desc: 'Manufacturing cooperation and custom smart ring development',
  },
  {
    href: '/en/smart-ring-oem-odm',
    name: 'OEM & ODM Technology',
    desc: 'Capability matrix: hardware, firmware, app, SDK, cloud API',
  },
  {
    href: '/partner/hospital',
    name: 'Hospital collaboration',
    desc: 'Clinical research / evaluation inquiries (form currently in Chinese)',
  },
  {
    href: '/partner/enterprise',
    name: 'Enterprise programs',
    desc: 'Workplace health and bulk procurement inquiries (form currently in Chinese)',
  },
];

export default function EnglishPartnerPage() {
  return (
    <main style={{ maxWidth: 760, margin: '60px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Partners</h1>
      <p style={{ color: '#666', marginTop: 10, lineHeight: 1.7 }}>
        {ENTITY_STATEMENT_EN} Choose the path that matches your program.
      </p>
      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {TYPES.map((type) => (
          <Link
            key={type.href}
            href={type.href}
            style={{
              display: 'block',
              padding: 20,
              border: '1px solid #eee',
              borderRadius: 8,
              color: 'inherit',
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 600 }}>{type.name}</div>
            <div style={{ color: '#888', fontSize: 14, marginTop: 4 }}>{type.desc}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
