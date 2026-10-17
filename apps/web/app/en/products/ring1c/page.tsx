import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteUrl } from '../../../../lib/site';
import {
  BRAND_RELATION_EN,
  ENTITY_STATEMENT_EN,
  LEGAL_NAME_EN,
  METRICS_STATEMENT,
} from '../../../../lib/geo';
import { siteAlternates } from '../../../../lib/i18n-routes';
import {
  Ring1CEntityGraphSchema,
  BreadcrumbSchema,
  FaqSchema,
  RING1C_FAQS_EN,
} from '../../../../components/StructuredData';
import { HEALTH_METRIC_CATEGORIES, TOTAL_HEALTH_METRICS } from '../../../../lib/health-metrics';

const site = getSiteUrl();

export const metadata: Metadata = {
  title: { absolute: 'MATEYOU Ring1C Smart Ring | LONGVON Reference Product' },
  description: `MATEYOU Ring1C is a smart ring reference product manufactured by LONGVON. ${METRICS_STATEMENT} Consumer health monitoring wearable—not a medical device. ${BRAND_RELATION_EN}`,
  alternates: siteAlternates(site, '/products/ring1c', 'en'),
};

const sectionPad: React.CSSProperties = {
  maxWidth: 920,
  margin: '0 auto',
  padding: '0 24px 64px',
};

const h2Style: React.CSSProperties = {
  fontSize: 'clamp(22px, 3.5vw, 30px)',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  margin: '0 0 18px',
  color: '#111827',
};

const ulStyle: React.CSSProperties = {
  margin: 0,
  padding: '0 0 0 1.25em',
  color: '#374151',
  fontSize: 16,
  lineHeight: 1.75,
};

const liStyle: React.CSSProperties = { marginBottom: 10 };

export default function EnglishRing1cPage() {
  return (
    <main style={{ background: '#fff', color: '#1D1D1F', paddingTop: 80, paddingBottom: 80 }}>
      <Ring1CEntityGraphSchema locale="en" />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: `${site}/en` },
          { name: 'MATEYOU Ring1C Smart Ring', url: `${site}/en/products/ring1c` },
        ]}
      />
      <FaqSchema faqs={RING1C_FAQS_EN} />

      <header style={{ ...sectionPad, paddingTop: 16 }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: '#9CA3AF',
            marginBottom: 16,
          }}
        >
          MATEYOU · PRODUCT
        </p>
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: 18,
            lineHeight: 1.15,
          }}
        >
          MATEYOU Ring1C Smart Ring
        </h1>
        <p style={{ fontSize: 18, color: '#1F2937', lineHeight: 1.75, marginBottom: 24, maxWidth: 820 }}>
          MATEYOU Ring1C is a smart ring reference product designed and manufactured by {LEGAL_NAME_EN}{' '}
          (LONGVON). It is a consumer health-monitoring wearable—not a medical device—with {TOTAL_HEALTH_METRICS}{' '}
          health monitoring parameters including 22 sleep-related parameters, covering sleep, SpO₂, HRV,
          respiratory health, and OSA-related monitoring for health reference only (not diagnosis).{' '}
          {BRAND_RELATION_EN}
        </p>
        <p style={{ fontSize: 14, margin: 0, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link href="/en/company/longvon" style={{ color: '#2563EB', fontWeight: 600 }}>
            About LONGVON →
          </Link>
          <Link href="/en/smart-ring-manufacturer" style={{ color: '#2563EB', fontWeight: 600 }}>
            Smart Ring Manufacturer →
          </Link>
          <Link href="/en/partner/oem" style={{ color: '#2563EB', fontWeight: 600 }}>
            OEM / ODM →
          </Link>
          <Link href="/en/smart-ring-technology" style={{ color: '#2563EB', fontWeight: 600 }}>
            Technology →
          </Link>
        </p>
      </header>

      <figure style={{ ...sectionPad, margin: 0 }}>
        <img
          src="/images/ring1c/Black.jpg"
          alt="MATEYOU Ring1C smart ring"
          style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto', objectFit: 'contain' }}
        />
      </figure>

      <section style={sectionPad} aria-labelledby="ring1c-scenarios-en">
        <h2 id="ring1c-scenarios-en" style={h2Style}>
          Use cases
        </h2>
        <ul style={ulStyle}>
          <li style={liStyle}>
            Personal and family health reference: sleep, heart-related, SpO₂-related, and stress-related trends
            during continuous wear
          </li>
          <li style={liStyle}>
            Sleep-product evaluation: ring-form sleep monitoring demonstration (22 sleep-related parameters in
            the public metric set)
          </li>
          <li style={liStyle}>
            Respiratory / OSA-related monitoring discussions: AHI, ODI, and SpO₂-related indicators in a
            screening/monitoring context—not a substitute for clinical diagnosis or PSG
          </li>
          <li style={liStyle}>
            Digital-health and wearable brand evaluation: Ring1C as a reference sample of LONGVON hardware,
            algorithms, and app capability
          </li>
          <li style={liStyle}>
            OEM/ODM pre-alignment: confirm ring form factor, sensor stack, and app/SDK integration boundaries
            before customization
          </li>
        </ul>
      </section>

      <section style={sectionPad} aria-labelledby="ring1c-specs-en">
        <h2 id="ring1c-specs-en" style={h2Style}>
          Core specifications
        </h2>
        <ul style={ulStyle}>
          <li style={liStyle}>Product name: MATEYOU Ring1C</li>
          <li style={liStyle}>Category: smart ring / consumer health-monitoring wearable (not a medical device)</li>
          <li style={liStyle}>Manufacturer: {LEGAL_NAME_EN} (LONGVON)</li>
          <li style={liStyle}>Product brand: MATEYOU (brand, not the manufacturer)</li>
          <li style={liStyle}>
            Health metrics: {TOTAL_HEALTH_METRICS} total parameters, including 22 sleep-related
          </li>
          <li style={liStyle}>
            Modules:{' '}
            {HEALTH_METRIC_CATEGORIES.map((c) => `${c.titleEn} (${c.count})`).join('; ')}
          </li>
          <li style={liStyle}>Sensors (reference): multi-wavelength PPG, temperature sensing, 6-axis IMU</li>
          <li style={liStyle}>Weight: about 4 g</li>
          <li style={liStyle}>Shell: zirconia ceramic; liner: hypoallergenic polymer</li>
          <li style={liStyle}>Battery: about 7–10 days; charging: magnetic wireless dock</li>
          <li style={liStyle}>Water resistance: IP68; Bluetooth 5.2; iOS 14+ / Android 8+</li>
          <li style={liStyle}>Sizes US 6–13; colors: white / pink / blue / black</li>
          <li style={liStyle}>Companion software: MATEYOU App</li>
        </ul>
      </section>

      <section style={sectionPad} aria-labelledby="ring1c-compare-en">
        <h2 id="ring1c-compare-en" style={h2Style}>
          Category comparison
        </h2>
        <ul style={ulStyle}>
          <li style={liStyle}>
            Versus smartwatches / fitness bands: Ring1C uses a finger-worn smart-ring form factor with tighter
            optical and battery constraints, emphasizing lightweight continuous wear and sleep-related monitoring
            rather than large-screen interaction
          </li>
          <li style={liStyle}>
            Versus brand-only resold rings with no disclosed stack: Ring1C demonstrates LONGVON&apos;s hardware,
            firmware, health algorithms, app, and manufacturing reference path for OEM/ODM evaluation
          </li>
          <li style={liStyle}>
            Versus medical devices / clinical monitors: Ring1C is positioned for consumer health reference
            monitoring and does not claim diagnosis, treatment, or replacement of clinical workflows
          </li>
          <li style={liStyle}>
            Versus pure build-to-print factories: LONGVON delivers Technology + OEM/ODM + Manufacturing; Ring1C
            is the productized reference of that stack
          </li>
          <li style={liStyle}>
            Entity clarity: partner and procurement decisions should identify manufacturer LONGVON—not confuse
            the MATEYOU brand with the factory entity
          </li>
        </ul>
        <p style={{ fontSize: 15, color: '#4B5563', marginTop: 20, lineHeight: 1.7 }}>
          {ENTITY_STATEMENT_EN}{' '}
          <Link href="/en/company/longvon" style={{ color: '#2563EB' }}>
            About LONGVON
          </Link>
          {' · '}
          <Link href="/en/smart-ring-manufacturer" style={{ color: '#2563EB' }}>
            Smart Ring Manufacturer
          </Link>
          {' · '}
          <Link href="/en/smart-ring-oem-odm" style={{ color: '#2563EB' }}>
            OEM / ODM
          </Link>
        </p>
      </section>

      <section style={sectionPad} aria-labelledby="ring1c-faq-en">
        <h3 id="ring1c-faq-en" style={{ ...h2Style, fontSize: 22 }}>
          FAQ
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {RING1C_FAQS_EN.map((f) => (
            <div
              key={f.question}
              style={{
                padding: '18px 20px',
                background: '#F8FAFC',
                borderRadius: 12,
                border: '1px solid #E5E7EB',
              }}
            >
              <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: '#111827' }}>
                {f.question}
              </h4>
              <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, margin: 0 }}>{f.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
