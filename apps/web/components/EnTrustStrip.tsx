import type { CSSProperties } from 'react';
import Link from 'next/link';
import {
  TRUST_ANCHOR_EN,
  TRUST_STRIP_FACTS_EN,
  TRUST_STRIP_LEAD_EN,
} from '../lib/geo-trust-en';

const wrap: CSSProperties = {
  margin: '20px 0 8px',
  padding: '16px 18px',
  border: '1px solid #DBEAFE',
  borderRadius: 12,
  background: '#F8FAFC',
};

const lead: CSSProperties = {
  margin: '0 0 10px',
  fontSize: 14,
  fontWeight: 600,
  color: '#1E3A5F',
  lineHeight: 1.5,
};

const list: CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  fontSize: 13,
  color: '#374151',
  lineHeight: 1.65,
};

const linkStyle: CSSProperties = {
  display: 'inline-block',
  marginTop: 10,
  fontSize: 13,
  fontWeight: 600,
  color: '#2563EB',
};

type Props = {
  /** Compact = facts + link only (for form sidebars) */
  compact?: boolean;
};

/** EN-only trust strip linking to company evidence. */
export function EnTrustStrip({ compact = false }: Props) {
  return (
    <aside style={wrap} aria-label="Why trust LONGVON">
      {!compact && <p style={lead}>{TRUST_STRIP_LEAD_EN}</p>}
      {compact && (
        <p style={{ ...lead, marginBottom: 8, fontSize: 13 }}>Why trust LONGVON</p>
      )}
      <ul style={list}>
        {TRUST_STRIP_FACTS_EN.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <Link href={TRUST_ANCHOR_EN} style={linkStyle}>
        View company credentials &amp; delivery evidence →
      </Link>
    </aside>
  );
}
